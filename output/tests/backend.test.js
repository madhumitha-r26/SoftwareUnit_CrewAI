const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server'); // Assuming app is exported from server.js
const User = require('../src/models/schemas').User;
const Task = require('../src/models/schemas').Task;

describe('TMS Backend Integration Tests', () => {
    let adminToken;
    let editorToken;
    let viewerToken;

    beforeAll(async () => {
        // Setup DB connection if not handled by server.js
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tms_test_db');
        }

        // Seed Users
        await User.deleteMany({});
        await Task.deleteMany({});
        
        const admin = await User.create({ username: 'admin', password: 'hashed_password', role: 'Admin' });
        const editor = await User.create({ username: 'editor', password: 'hashed_password', role: 'Editor' });
        const viewer = await User.create({ username: 'viewer', password: 'hashed_password', role: 'Viewer' });

        // Mock tokens (In real scenario, call /api/auth/login)
        adminToken = 'mock-admin-jwt';
        editorToken = 'mock-editor-jwt';
        viewerToken = 'mock-viewer-jwt';
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('RBAC - US.1', () => {
        it('should prevent Viewer from creating a task', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${viewerToken}`)
                .send({ title: 'Viewer Task', description: 'Should fail', status: 'To-Do' });
            
            expect(res.status).toBe(403);
        });

        it('should allow Editor to create a task', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${editorToken}`)
                .send({ title: 'Editor Task', description: 'Should pass', status: 'To-Do' });
            
            expect(res.status).toBe(201);
        });
    });

    describe('State Machine - US.4', () => {
        it('should block transition from To-Do directly to Done', async () => {
            const task = await Task.create({ title: 'State Test', status: 'To-Do', version: 0 });
            const res = await request(app)
                .patch(`/api/tasks/${task._id}`)
                .set('Authorization', `Bearer ${editorToken}`)
                .send({ status: 'Done' });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/follow the workflow/i);
        });
    });

    describe('DAG Logic - US.6', () => {
        it('should detect and reject circular dependencies', async () => {
            const taskA = await Task.create({ title: 'Task A', status: 'To-Do' });
            const taskB = await Task.create({ title: 'Task B', status: 'To-Do', dependencies: [taskA._id] });

            const res = await request(app)
                .patch(`/api/tasks/${taskA._id}`)
                .set('Authorization', `Bearer ${editorToken}`)
                .send({ dependencies: [taskB._id] });
            
            expect(res.status).toBe(409);
            expect(res.body.message).toBe('Circular Dependency Detected');
        });
    });

    describe('Optimistic Locking - Edge Case', () => {
        it('should prevent lost updates via versioning', async () => {
            const task = await Task.create({ title: 'Lock Test', status: 'To-Do', version: 0 });
            
            // User 1 updates
            await request(app)
                .patch(`/api/tasks/${task._id}`)
                .set('Authorization', `Bearer ${editorToken}`)
                .send({ title: 'Updated by User 1', version: 0 });

            // User 2 tries to update using old version 0
            const res = await request(app)
                .patch(`/api/tasks/${task._id}`)
                .set('Authorization', `Bearer ${editorToken}`)
                .send({ title: 'Updated by User 2', version: 0 });
            
            expect(res.status).toBe(409); // Conflict
        });
    });
});
