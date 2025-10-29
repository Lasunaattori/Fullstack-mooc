const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const testperson1 = { title: 'lmao2', author: 'Anssi', url: 'bbb', likes: 33 }
const testperson2 = { title: 'lmao2', author: 'Anssi', url: 'bbb', likes: 44 }
const testperson3 = { title: 'lmao2', author: 'Anssi1', url: 'bbb', likes: 44 }
const testperson4 = { title: 'lmao2', author: 'Anssi2', url: 'bbb', likes: 88 }

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog likes equal to likes of that', () => {
    assert.strictEqual(listHelper.totalLikes([testperson1]), 33)
  })

  test('of a bigger list is calculater right', () => {
    assert.strictEqual(listHelper.totalLikes([testperson1, testperson2]), 77)
  })
})

describe('Favorite Blog', () =>{
  test('favorite blog', () => {
    const blogs1 = [testperson1, testperson2,testperson3,testperson4]
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs1).likes, 88)
  })
})

describe('Most blogs by author', () => {
  test('most blogs', () => {
    const blogs2 = [testperson1, testperson2,testperson3,testperson4]
    assert.deepStrictEqual(listHelper.mostBlogs(blogs2), { author:"Anssi", blogs:2 })
  })
})

describe('Most likes by author', () => {
  test('most likes', () => {
    const blogs2 = [testperson1, testperson2,testperson3,testperson4]
    assert.deepStrictEqual(listHelper.mostLikes(blogs2), { author:"Anssi2", likes:88 })
  })
})