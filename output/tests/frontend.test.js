import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanBoard from './src/pages/KanbanBoard';
import { AuthProvider } from './src/context/AuthContext';
import axios from 'axios';

vi.mock('axios');

describe('KanbanBoard Frontend Tests', () => {
    const mockUser = { username: 'testuser', role: 'Editor' };

    const renderWithAuth = (ui) => {
        return render(
            <AuthProvider initialUser={mockUser}>
                {ui}
            </AuthProvider>
        );
    };

    it('should render all four required columns', () => {
        renderWithAuth(<KanbanBoard />);
        expect(screen.getByText(/To-Do/i)).toBeInTheDocument();
        expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
        expect(screen.getByText(/Review/i)).toBeInTheDocument();
        expect(screen.getByText(/Done/i)).toBeInTheDocument();
    });

    it('should disable drag-and-drop for Viewer role', () => {
        renderWithAuth(<KanbanBoard userRole="Viewer" />);
        const taskCard = screen.getByTestId('task-card-1');
        expect(taskCard).toHaveAttribute('draggable', 'false');
    });

    it('should show blocked icon for tasks with unfinished dependencies', async () => {
        const mockTasks = [
            { id: '1', title: 'Blocked Task', status: 'To-Do', isBlocked: true }
        ];
        axios.get.mockResolvedValue({ data: mockTasks });

        renderWithAuth(<KanbanBoard />);
        
        await waitFor(() => {
            expect(screen.getByTestId('blocked-icon-1')).toBeInTheDocument();
        });
    });

    it('should trigger API call on task move', async () => {
        renderWithAuth(<KanbanBoard />);
        const taskCard = screen.getByTestId('task-card-1');
        
        // Simulate drag end to 'In Progress'
        fireEvent.drop(screen.getByTestId('column-in-progress'), {
            dataTransfer: { getData: () => 'task-1' }
        });

        expect(axios.patch).toHaveBeenCalledWith(
            expect.stringContaining('/api/tasks/task-1'),
            expect.objectContaining({ data: expect.objectContaining({ status: 'In Progress' }) })
        );
    });
});
