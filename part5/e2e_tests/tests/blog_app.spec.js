const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testingUserName',
        name: 'testingName',
        password: 'testingPassword'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'anotherTestingUserName',
        name: 'anotherTestingName',
        password: 'anotherTestingPassword'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })
  
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username:' }).fill('testingUserName')
      await page.getByRole('textbox', { name: 'password:' }).fill('testingPassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('testingUserName logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username:' }).fill('wrongTestingUserName')
      await page.getByRole('textbox', { name: 'password:' }).fill('wrongTestingPassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrongTestingUserName logged in')).toBeHidden()
    })
  
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox', { name: 'username:' }).fill('testingUserName')
      await page.getByRole('textbox', { name: 'password:' }).fill('testingPassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('testingUserName logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title:' }).fill('testBlogTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('testBlogAuthor')
      await page.getByRole('textbox', { name: 'url:' }).fill('tesstBlogUrl')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('testBlogTitle')).toBeVisible()
    })
    
    test('a like can be added to blog', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title:' }).fill('testBlogTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('testBlogAuthor')
      await page.getByRole('textbox', { name: 'url:' }).fill('tesstBlogUrl')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view details' }).click()
      await expect(page.getByText('0')).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('Blog can be removed', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title:' }).fill('testBlogTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('testBlogAuthor')
      await page.getByRole('textbox', { name: 'url:' }).fill('tesstBlogUrl')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view details' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'Remove blog' }).click()
      await expect(page.getByText('removed')).toBeVisible()
    })

    test('Cannot see delete button with another user than blog creator', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title:' }).fill('testBlogTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('testBlogAuthor')
      await page.getByRole('textbox', { name: 'url:' }).fill('tesstBlogUrl')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByRole('textbox', { name: 'username:' }).fill('anotherTestingUserName')
      await page.getByRole('textbox', { name: 'password:' }).fill('anotherTestingPassword')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view details' }).click()
      await expect(page.getByText('Remove blog')).not.toBeVisible()
    })

    test('Blogs are sorted by likes', async ({ page }) => {
      /**Create first blog */
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title:' }).fill('testBlogTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('testBlogAuthor')
      await page.getByRole('textbox', { name: 'url:' }).fill('testBlogUrl')
      await page.getByRole('button', { name: 'create' }).click()

      /**Create second blog */
      await page.getByRole('textbox', { name: 'title:' }).fill('anotherTestBlogTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('anotherTestBlogAuthor')
      await page.getByRole('textbox', { name: 'url:' }).fill('anotherTestBlogUrl')
      await page.getByRole('button', { name: 'create' }).click()

      /**Open first blog details, give one like and hide details */
      await page.getByRole('button', { name: 'view details' }).first().click()
      await expect(page.getByText('testBlogUrl',{exact:true})).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText('1 Like')).toBeVisible()
      await page.getByRole('button', { name: 'hide details' }).click()

      /**Open second blog details, give two likes and hide details */
      await page.getByRole('button', { name: 'view details' }).last().click()
      await expect(page.getByText('AnotherTestBlogUrl')).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText('AnotherTestBlogUrl')).toBeVisible()
      await expect(page.getByRole('paragraph').filter({ hasText: '1' })).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).last().click()
      await expect(page.getByRole('paragraph').filter({ hasText: '2' })).toBeVisible()
      await page.getByRole('button', { name: 'hide details' }).click()

      /**Open details of first blog in order using .first(), and check that its the blog we gave two likes to */
      await page.getByRole('button', { name: 'view details' }).first().click()
      await expect(page.getByText('AnotherTestBlogUrl')).toBeVisible()
    })
  })
  })
})