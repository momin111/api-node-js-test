import { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";

const baseURL = 'http://localhost:5000/users';

export class ApiClient {
    async getUsers(request: APIRequestContext) {
        const response = await request.get(baseURL);
        expect(response.status()).toBe(StatusCodes.OK);
        return await response.json();
    }
    async createUser(request: APIRequestContext) {
        const response = await request.post(baseURL);
        expect(response.status()).toBe(StatusCodes.CREATED);
        return await response.json();
    }
    async deleteUserById(request: APIRequestContext, userId: number) {
        const response = await request.delete(`${baseURL}/${userId}`);
        expect(response.status()).toBe(StatusCodes.OK);
    }
    async deleteAllUsers(request: APIRequestContext) {
        const users = await this.getUsers(request);
        for (const user of users)
        {
            await this.deleteUserById(request, user.id);
        }
        const remainingUsers = await this.getUsers(request);
        expect(remainingUsers).toHaveLength(0);
    }
}