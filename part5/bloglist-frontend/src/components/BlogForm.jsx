import { useState } from 'react'
import Notification from './Notification'

const BlogForm = ({ createBlog, user }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [Message, setMessage] = useState(null)

  const handleAddBlog = async event => {
    event.preventDefault()
    console.log('Adding new blog ', blogTitle, blogAuthor, blogUrl, user.name)
    try {
      createBlog({ newBlog: { title: blogTitle, author: blogAuthor, url: blogUrl }, token: user.token })
      setMessage(`New blog ${blogTitle} by ${blogAuthor} added`)
      //Clear forms after adding new blog
      setBlogAuthor('')
      setBlogTitle('')
      setBlogUrl('')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setMessage('Error when adding new blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleAddBlog}>
      <Notification message={ Message } />
      <div>
        <label>
          title:
          <input
            type="text"
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm