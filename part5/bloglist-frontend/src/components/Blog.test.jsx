import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('renders Blog correct', () => {
    const user1 = {
        username: 'TestUserName'
    }
    const blog = {
        title: 'Title for testing',
        author: 'TestAuthor',
        url: 'TestURL',
        likes: '2',
        user: {user1}
    }

    render(<Blog blog={blog} user={user1}/>)

    const element0 = screen.getByText('Title for testing', { exact: false })
    const element1 = screen.getByText('TestAuthor', { exact: false })
    const element2 = screen.queryByText('TestURL', { exact: false })
    const element3 = screen.queryByText('2', { exact: false })

    expect(element2).not.toBeVisible()
    expect(element3).not.toBeVisible()
})

test('After show details click all blog properties visible', async () => {
    const user1 = {
        username: 'TestUserName'
    }
    const blog = {
        title: 'Title for testing',
        author: 'TestAuthor',
        url: 'TestURL',
        likes: '2',
        user: {user1}
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={user1}/>)

    const user = userEvent.setup()
    const button = screen.getByText('View details')
    await user.click(button)

    const element0 = screen.getByText('Title for testing', { exact: false })
    const element1 = screen.getByText('TestAuthor', { exact: false })
    const element2 = screen.getByText('TestURL', { exact: false })
    const element3 = screen.getByText('2', { exact: false })
})

test('Like button clicked twice', async () => {
    const user1 = {
        username: 'TestUserName'
    }
    const blog = {
        title: 'Title for testing',
        author: 'TestAuthor',
        url: 'TestURL',
        likes: '2',
        user: {user1}
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={user1} handleAddLike={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('View details')
    await user.click(button)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('', async () => {
    const user1 = {
        username: 'TestUserName'
    }
    const blog = {
        title: 'Title for testing',
        author: 'TestAuthor',
        url: 'TestURL',
        likes: '2',
        user: {user1}
    }

    const mockHandler = vi.fn()

    render(<BlogForm user={user1} createBlog={mockHandler}/>)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title:')
    await user.type(titleInput, blog.title)
    const authorInput = screen.getByLabelText('author:')
    await user.type(authorInput, blog.author)
    const urlInput = screen.getByLabelText('url:')
    await user.type(urlInput, blog.url)
    
    const submitButton = screen.getByText('create')
    await user.click(submitButton)

    expect(mockHandler.mock.calls[0][0].newBlog.title).toBe(blog.title)
    expect(mockHandler.mock.calls[0][0].newBlog.author).toBe(blog.author)
    expect(mockHandler.mock.calls[0][0].newBlog.url).toBe(blog.url)
})