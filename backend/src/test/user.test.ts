/* eslint-disable @typescript-eslint/no-unused-vars */
import request from "supertest"
import app from ".."
import connectDatabase from "../database/mongooseDatabase";
import mongoose from "mongoose";
import { z } from 'zod'
import { User } from "../model/userModel";
// jest.mock(homeController)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userType = z.object({
    "_id": z.string().optional(),
    "name": z.string(),
    "username": z.string(),
    "city": z.string(),
    "status": z.string(),
    "addTime": z.string().optional()
})
const dataType = z.object({
    success: z.boolean(),
    user: userType
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const responseType = z.object({
    statusCode: z.number().optional(),
    body: dataType
})



beforeAll(async () => {
    await connectDatabase()

});

afterAll(async () => {
    await mongoose.connection.close();
});
describe('Test API Get User', () => {
    test('Should return All data', async () => {
        const Response = await request(app).get('/home')
        expect(Response.statusCode).toBe(200)
        expect(Response.body.success).toBe(true)
    })
})

describe('Test API Get User with spesific clue', () => {
    test('Should return a data with match _id', async () => {
        const userInput = '66a8b3a7913abcdd86a99a11'
        const Response: z.infer<typeof responseType> = await request(app).get(`/search/${userInput}`)
        expect(Response.statusCode).toBe(200)
        expect(Response.body.success).toBe(true)
        expect(Response.body.user._id).toBe(userInput)

    })
    test('Should return a data with match username', async () => {
        const userInput = '@Sari'
        const Response: z.infer<typeof responseType> = await request(app).get(`/search/${userInput}`)
        expect(Response.statusCode).toBe(200)
        expect(Response.body.success).toBe(true)
        expect(Response.body.user.username).toBe(userInput)
    })
    test('Should return an Error', async () => {
        const userInput = 'ee'
        const Response: z.infer<typeof responseType> = await request(app).get(`/search/${userInput}`)
        expect(Response.statusCode).toBe(400)
        expect(Response.body.success).toBeFalsy()
    })
})

describe('Add another user with different username', () => {
    beforeEach(async () => {
        const existingUser = await User.findOne({ username: '@Lodash' });
        if (existingUser !== null) {
            await User.deleteOne({ username: '@Lodash' })
            // console.log('User after deletion:', existingUser);
        }
    })
    test('test add user', async () => {
        const data = {
            name: 'Lodash',
            username: '@Lodash',
            city: 'Pemalang',
            status: 'Menikah',
        }
        const Response: z.infer<typeof responseType> = await request(app).post('/user/add').send(data)
        expect(Response.statusCode).toBe(200)
        expect(Response.body.success).toBe(true)
        expect(Response.body.user.name).toBe('Lodash');
        expect(Response.body.user.username).toBe('@Lodash');
        expect(Response.body.user.city).toBe('Pemalang');
        expect(Response.body.user.status).toBe('Menikah');
    })

})

describe('Update user by Id', () => {
    test('should can update user', async () => {
        const idUser = '66afc18815c057328b3d1d5f'
        const data = {
            name: 'Raju Sing',
            username: '@Singing',
            city: 'Bangladesh',
            status: 'TKW',
        }
        const Response = await request(app).put(`/user/update/${idUser}`).send(data)
        // console.log(Response.body)
        expect(Response.statusCode).toBe(200)
        expect(Response.body.user.status).toBe('TKW')


    })
})

describe('Delete User by Id', () => {
    let customId: mongoose.Types.ObjectId;
    beforeEach(async () => {
        customId = new mongoose.Types.ObjectId()
        const fakeData = {
            _id: customId,
            name: 'admin',
            username: '@admin',
            city: 'Jayakarta',
            status: 'pending'
        }
        const newUser = await new User(fakeData)
        await newUser.save()
    })
    test('should can delete the user', async () => {
        const Response = await request(app).delete(`/user/delete/${customId}`)
        expect(Response.status).toBe(200)
        expect(Response.body.success).toBeTruthy()
    })
})