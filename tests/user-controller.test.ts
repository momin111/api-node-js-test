// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";
let baseURL: string = 'http://localhost:5000/users';

test.describe('User management API', () => {

    let existingUserId: number

    test('GET / - should return empty when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('POST / - should add a new user', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.CREATED);
        expect.soft(response.status()).toBe(201);
        const returnedUser = await response.json()
        existingUserId = returnedUser.id

        const usersResponse = await request.get(`${baseURL}`);
        expect(usersResponse.status()).toBe(StatusCodes.OK);
        const users = await usersResponse.json()

        const user = users.find((user: { id: number; }) => user.id === existingUserId)
        expect.soft(user).toEqual(returnedUser)
    });

    test('GET /:id - should return a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.CREATED);
        expect.soft(response.status()).toBe(201);
        const responseBody = await response.json()
        expect.soft(responseBody.id).toBeDefined();
        expect.soft(responseBody.name).toBeDefined();
        expect.soft(responseBody.email).toBeDefined();
        expect.soft(responseBody.phone).toBeDefined();
        existingUserId = responseBody.id

        const usersResponse = await request.get(`${baseURL}`);
        expect(usersResponse.status()).toBe(StatusCodes.OK);
        const users = await usersResponse.json()
        const user = users.find((user: { id: number; }) => user.id === existingUserId)
        expect.soft(user).toEqual(responseBody)
        const getResponse = await request.get(`${baseURL}/${existingUserId}`);
        expect(getResponse.status()).toBe(StatusCodes.OK);
        expect.soft(getResponse.status()).toBe(200);
        const getResponseBody = await getResponse.json()
        expect.soft(getResponseBody.id).toBe(existingUserId);
    });

    test('GET /:id - should return 404 if user not found', async ({ request }) => {
        const id = 50
        const response = await request.get(`${baseURL}/${id}`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND);
        expect.soft(response.status()).toBe(404);
        const responseBody = await response.json()
        expect.soft(responseBody.message).toMatch("User not found")
    });

    test('DELETE /:id - should delete a user by ID', async ({ request }) => {
        const response = await request.post(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.CREATED);
        expect.soft(response.status()).toBe(201);
        const returnedUser = await response.json()
        existingUserId = returnedUser.id

        const usersResponse = await request.get(`${baseURL}`);
        expect(usersResponse.status()).toBe(StatusCodes.OK);
        const users = await usersResponse.json()
        const user = users.find((user: { id: number; }) => user.id === existingUserId)
        expect.soft(user).toEqual(returnedUser)
        const firstGetResponse = await request.get(`${baseURL}/${existingUserId}`);
        expect(firstGetResponse.status()).toBe(StatusCodes.OK);
        expect.soft(firstGetResponse.status()).toBe(200);
        const deleteResponse= await request.delete(`${baseURL}/${existingUserId}`);
        expect(deleteResponse.status()).toBe(StatusCodes.OK);
        const getResponseAfterDelete = await request.get(`${baseURL}/${existingUserId}`);
        expect(getResponseAfterDelete.status()).toBe(StatusCodes.NOT_FOUND);
        expect.soft(getResponseAfterDelete.status()).toBe(404);
    });

    test('DELETE /:id - should return 404 if user not found', async ({ request }) => {
        const response = await request.delete(`${baseURL}/${existingUserId}`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND);
        expect.soft(response .status()).toBe(404);
    });
});
