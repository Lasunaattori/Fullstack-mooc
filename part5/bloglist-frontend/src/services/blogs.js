import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data.sort((firstItem, secondItem) => secondItem.likes - firstItem.likes)
}

const addNew = async ({ newBlog, token }) => {
  await axios.post(baseUrl, newBlog, { headers: { Authorization: `Bearer ${token}` } })
}

const addLike = async (updatedBlog) => {
  const endPoint = baseUrl.concat(`/${updatedBlog.blog.id}`)
  const updateBlogObject = {
    user: updatedBlog.blog.user.id,
    likes: updatedBlog.blog.likes + 1,
    author: updatedBlog.blog.author,
    title: updatedBlog.blog.title,
    url: updatedBlog.blog.url
  }
  await axios.put(endPoint, updateBlogObject, { headers: { Authorization: `Bearer ${updatedBlog.token}` } })
}

const deleteBlog = async (deletedBlog) => {
  const endPoint = baseUrl.concat(`/${deletedBlog.blog.id}`)
  const response = await axios.delete(endPoint, { headers: { Authorization: `Bearer ${deletedBlog.token}` } })
  return response
}

export default { getAll, addNew, addLike, deleteBlog }