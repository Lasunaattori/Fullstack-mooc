import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [Message, setMessage] = useState(null)

  console.log(blogs)
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessage('Error! Login with wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser('')
  }

  const logOutButton = () => (
    <button type="button" onClick={handleLogOut}>
      logout
    </button>
  )

  const addBlog = async blogObject => {
    await blogService.addNew(blogObject)
    const response = await blogService.getAll()
    setBlogs(response)
  }

  const addLike = async blogObject => {
    await blogService.addLike(blogObject)
    const response = await blogService.getAll()
    setBlogs(response)
  }

  const deleteBlog = async blogObject => {
    await blogService.deleteBlog(blogObject)
    const response = await blogService.getAll()
    setBlogs(response)
    setMessage(`${blogObject.blog.title} by ${blogObject.blog.author} removed`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm
        createBlog={addBlog}
        user = {user}
      />
    </Togglable>
  )

  const showBlogs = () => (
    <div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleAddLike={addLike}
          handleDelete={deleteBlog}
          user={user} />
      )}
    </div>
  )

  if (!user) {
    return(
      <div>
        <h2>Log in to application</h2>
        <Notification message={ Message } />
        {loginForm()}
      </div>
    )
  } else {
    return(
      <div>
        <h2>blogs</h2>
        <p>{user.username} logged in {logOutButton()} </p>
        <Notification message={ Message } />
        <h2>Create new</h2>
        {blogForm()}
        <p></p>
        {showBlogs()}
      </div>
    )
  }
}

export default App