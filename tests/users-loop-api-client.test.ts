import { test, expect } from '@playwright/test';
import { ApiClient } from '../src/controllers/api-client';

test.describe('User Management API Tests with api client', () => {
    let apiClient: ApiClient;
    test.beforeEach(async ({request}) => {
        apiClient = new ApiClient();
        await apiClient.deleteAllUsers(request);
    });

    test('GET / - should return empty when no users', async ({request}) => {
        const users = await apiClient.getUsers(request);
        expect(users).toEqual([]);
    });

    test('Create few users and verify total number', async ({request}) => {
        const numberOfUsers = 5;
        const createdUsers = [];
        for (let i = 0; i < numberOfUsers; i++) {
            const user = await apiClient.createUser(request);
            createdUsers.push(user);
        }
        const users = await apiClient.getUsers(request);
        expect(users).toHaveLength(numberOfUsers);
        expect(users).toEqual(createdUsers);
    });

    test('Create N users, delete all users, and verify empty response', async ({request}) => {
        const userCount = 5;
        for (let i = 0; i < userCount; i++) {
            await apiClient.createUser(request);
        }
        await apiClient.deleteAllUsers(request);
        const usersAfterDelete = await apiClient.getUsers(request);
        expect(usersAfterDelete).toEqual([]);
    });

    test('Create N users, delete one user, and verify remaining users', async ({request}) => {
        const userCount = 4;
        const createdUsers: any[] = [];
        for (let i = 0; i < userCount; i++) {
            const user = await apiClient.createUser(request);
            createdUsers.push(user);
        }
        await apiClient.deleteUserById(request, createdUsers[0].id);
        const usersAfterDelete = await apiClient.getUsers(request);
        expect(usersAfterDelete).toHaveLength(userCount - 1);
        const deletedUser = usersAfterDelete.find((user: { id: any; }) => user.id === createdUsers[0].id);
        expect(deletedUser).toBeUndefined();
    });
});