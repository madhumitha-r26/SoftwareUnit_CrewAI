import { expect, test, describe } from '@playwright/test';

/**
 * TEST SUITE: Workflow A - Onboarding & First Task
 * Requirement: US.1, US.3
 */
describe('Workflow A: Onboarding & First Task', () => {
    test('should allow a new user to create their first task', async ({ page }) => {
        // 1. Sign up/Login (Mocked for MVP Frontend)
        await page.goto('/');
        // Assuming mock login is handled or automatic for the demo
        
        // 2. Verify Empty State
        await expect(page.locator('text=Welcome')).toBeVisible();
        await expect(page.locator('text=Create your first task')).toBeVisible();
        
        // 3. Create Task
        await page.click('text=Add Task');
        await page.fill('input[name="title"]', 'Test First Task');
        await page.fill('textarea[name="description"]', 'This is a test description');
        await page.fill('input[name="deadline"]', '2025-12-31');
        await page.selectOption('select[name="category"]', 'Work');
        await page.click('button:has-text("Save")');
        
        // 4. Verify task appears immediately
        await expect(page.locator('text=Test First Task')).toBeVisible();
    });
});

/**
 * TEST SUITE: Workflow B - Task Lifecycle Management
 * Requirement: US.4, US.5, US.6
 */
describe('Workflow B: Task Lifecycle Management', () => {
    test('should allow updating, completing, and deleting a task', async ({ page }) => {
        await page.goto('/');
        
        // Setup: Create task
        await page.click('text=Add Task');
        await page.fill('input[name="title"]', 'Lifecycle Task');
        await page.fill('input[name="deadline"]', '2025-12-31');
        await page.click('button:has-text("Save")');

        // Edit Task (US.4)
        await page.click('text=Edit'); 
        await page.fill('input[name="title"]', 'Updated Lifecycle Task');
        await page.click('button:has-text("Save")');
        await expect(page.locator('text=Updated Lifecycle Task')).toBeVisible();

        // Complete Task (US.5)
        await page.check('input[type="checkbox"]');
        await expect(page.locator('text=Updated Lifecycle Task')).toHaveCSS('text-decoration', /line-through/);

        // Delete Task (US.6)
        await page.click('button:has-text("Delete")');
        // Handle confirmation dialog
        await page.click('button:has-text("Confirm")');
        await expect(page.locator('text=Updated Lifecycle Task')).not.toBeVisible();
    });
});

/**
 * TEST SUITE: Workflow C - Organization & Filtering
 * Requirement: US.7, US.8
 */
describe('Workflow C: Organization & Filtering', () => {
    test('should filter tasks by category', async ({ page }) => {
        await page.goto('/');
        
        // Setup: Create tasks in different categories
        const categories = ['Work', 'Personal', 'Urgent'];
        for (const cat of categories) {
            await page.click('text=Add Task');
            await page.fill('input[name="title"]', `Task ${cat}`);
            await page.selectOption('select[name="category"]', cat);
            await page.click('button:has-text("Save")');
        }

        // Filter by "Work"
        await page.click('text=Work');
        await expect(page.locator('text=Task Work')).toBeVisible();
        await expect(page.locator('text=Task Personal')).not.toBeVisible();
        await expect(page.locator('text=Task Urgent')).not.toBeVisible();
    });
});

/**
 * EDGE CASE TESTS
 * Requirement: Section 5 of BRD
 */
describe('Edge Case Handling', () => {
    test('should prevent selecting a past date', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Add Task');
        
        // Set date to yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateString = yesterday.toISOString().split('T')[0];
        
        await page.fill('input[name="deadline"]', dateString);
        await page.click('button:has-text("Save")');
        
        await expect(page.locator('text=Deadline cannot be in the past')).toBeVisible();
    });

    test('should prevent duplicate creation on rapid clicks', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Add Task');
        await page.fill('input[name="title"]', 'Rapid Task');
        
        // Rapid click save button
        await page.click('button:has-text("Save")', { clickCount: 5 });
        
        // Check if only one instance of the task was created
        const tasks = page.locator('text=Rapid Task');
        await expect(tasks).toHaveCount(1);
    });
});
