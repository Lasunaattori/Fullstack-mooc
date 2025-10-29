const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('Users api tests', () => {

    initialUsers = [
        {
            username: '',
            name: 'name',
            password: '1234'
        },
        {
            username: 'username',
            name: 'name',
            password: ''
        },
        {
            username: 'us',
            name: 'name',
            password: '1234'
        },
        {
            username: 'username',
            name: 'name',
            password: '12'
        },
        {
            username: 'username',
            name: 'name',
            password: '1234'
        },
        {
            username: 'username',
            name: 'name',
            password: '1234'
        },
    ]
    })

    test('Invalid user creation tests', async () => {
        await User.deleteMany({})
        await api.post('/api/users').send(initialUsers[0]).expect(400)
        await api.post('/api/users').send(initialUsers[1]).expect(400)
        await api.post('/api/users').send(initialUsers[2]).expect(400)
        await api.post('/api/users').send(initialUsers[3]).expect(400)
        await api.post('/api/users').send(initialUsers[4]).expect(201)
        await api.post('/api/users').send(initialUsers[5]).expect(400)
    })

after(async () => {
    await mongoose.connection.close()
})