const assert = require('node:assert')
const { test, after, beforeEach, before, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')


const api = supertest(app)

describe('Blog api tests', () => {
const initialBlogs = [
    { 
        title: 'title1',
        author: 'author1',
        url: 'url1',
        likes: 11
    },
    { 
        title: 'title2',
        author: 'author2',
        url: 'url2',
        likes: 22
    },
    { 
        title: 'title3',
        author: 'author3',
        url: 'url3',
        likes: 33
    }
    ]
    
    before(async() => {
        const testUser = {
        username: "testuser",
        name: "testname",
        password: "test123"
        }

        await api.post('/api/users').send(testUser).expect(201)
        loginResponse = await api.post('/api/login').send({username:"testuser", password:"test123"})
        const bearer = 'Bearer '
        // No const or var to create global variable, usable in other tests. Not sure how correct this is
        token = bearer.concat(loginResponse.body.token)
    })

    beforeEach(async() => {
        await Blog.deleteMany({})
        for (const elem of initialBlogs) {
            await api.post('/api/blogs').send(elem).set('Authorization', token).expect(201)
        }
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 3)
    })

    test('id is named correctly', async () => {
        const response = await api.get('/api/blogs')
        // assert.ok checks if the value is "falsy", ie. checks if 'id' key of first blog is undefined or not. 
        assert.ok(response.body[0].id)
    })

    test('new blog is added correctly', async() => {
        const response = await api.get('/api/blogs')
        const blogsAtBeginning = response.body.length
        const newBlog = {
            title: 'test title',
            author: 'test author',
            url: 'test url',
            likes: '99'
        }
        await api.post('/api/blogs').send(newBlog).set('Authorization', token).expect(201).expect('Content-Type', /application\/json/)

        const response1 = await api.get('/api/blogs')
        const blogsAtEnd = response1.body.length
        assert.strictEqual(blogsAtBeginning + 1, blogsAtEnd)

        const concatenatedElementsArray = response1.body.map(element => element.title + ' ' + element.author + ' ' + element.url + ' ' + element.likes)
        assert(concatenatedElementsArray.includes(newBlog.title + ' ' + newBlog.author + ' ' + newBlog.url + ' ' + newBlog.likes))
    })

    test('default like is 0', async() => {
        const newBlog = {
            title: 'default like title',
            author: 'default like author',
            url: 'default like url', 
        }

        const newBlogResponse = await api.post('/api/blogs').send(newBlog).set('Authorization', token).expect(201).expect('Content-Type', /application\/json/)
        assert.strictEqual(newBlogResponse.body.likes, 0)
    })

    test('missing title and url', async() => {
        const newBlog1 = {
            author: 'missing title author',
            url: 'missing title url'
        }

        await api.post('/api/blogs').send(newBlog1).set('Authorization', token).expect(400)

        const newBlog2 = {
            title: 'missing url title',
            author: 'missing url author'
        }

        await api.post('/api/blogs').set('Authorization', token).send(newBlog2).expect(400)
    })

    test('single blog can be deleted', async() => {
        const response = await api.get('/api/blogs')
        const blogsAtBeginning = response.body.length

        const newBlog3 = {
            title: 'deletion test title',
            author: 'deletion test author',
            url: 'deletion test url',
            likes: '99'
        }
        const deletionBlog = await api.post('/api/blogs').send(newBlog3).set('Authorization', token).expect(201).expect('Content-Type', /application\/json/)
        await api.delete(`/api/blogs/${deletionBlog.body.id}`).set('Authorization', token).expect(204)
        const response1 = await api.get('/api/blogs')
        const blogsAtEnd = response1.body.length
        assert.strictEqual(blogsAtBeginning, blogsAtEnd)
    })

    test('single blog can be updated', async() => {
        const blogsAtBeginning = await api.get('/api/blogs')
        const blogToBeUpdated = blogsAtBeginning.body[0]

        const newBlogContents = {
            title: 'Updated title',
            author: 'Updated author',
            url: 'Updated url',
            likes: 999
        }

        await api.put(`/api/blogs/${blogToBeUpdated.id}`).send(newBlogContents)
        const blogsAtEnd = await api.get('/api/blogs')
        
        const concatenatedElementsArray1 = blogsAtEnd.body.map(element => element.title + ' ' + element.author + ' ' + element.url + ' ' + element.likes)
        assert.strictEqual(concatenatedElementsArray1.length, blogsAtBeginning.body.length)
        assert(concatenatedElementsArray1.includes(newBlogContents.title + ' ' + newBlogContents.author + ' ' + newBlogContents.url + ' ' + newBlogContents.likes)) 
        
        })
    

    test('Unauthorized blog creation', async() => {
        const newBlog = {
            title: 'default like title',
            author: 'default like author',
            url: 'default like url', 
        }

        await api.post('/api/blogs').send(newBlog).expect(401)
        })
    })

    after(async () => {
        await User.deleteMany({})
        await mongoose.connection.close()
    })