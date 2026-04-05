import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('shows 5 categories on home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('База знаний AdCorp')).toBeVisible()
    await expect(page.getByText('Новому сотруднику')).toBeVisible()
    await expect(page.getByText('О компании')).toBeVisible()
    await expect(page.getByText('Организация работы')).toBeVisible()
    await expect(page.getByText('Корпоративная жизнь')).toBeVisible()
    await expect(page.getByText('Обратная связь')).toBeVisible()
  })

  test('navigate: home → category → article → home', async ({ page }) => {
    await page.goto('/')

    // Click category
    await page.getByText('Организация работы').click()
    await expect(page.getByText('Зарплата и выплаты')).toBeVisible()

    // Check breadcrumbs
    await expect(page.getByRole('navigation', { name: 'Хлебные крошки' })).toContainText('Главная')
    await expect(page.getByRole('navigation', { name: 'Хлебные крошки' })).toContainText(
      'Организация работы',
    )

    // Click article
    await page.getByText('Зарплата и выплаты').click()
    await expect(page.getByText('Ещё в этом разделе')).toBeVisible()

    // Breadcrumbs now have 3 levels
    const breadcrumb = page.getByRole('navigation', { name: 'Хлебные крошки' })
    await expect(breadcrumb).toContainText('Главная')
    await expect(breadcrumb).toContainText('Организация работы')
    await expect(breadcrumb).toContainText('Зарплата и выплаты')

    // Go home via breadcrumbs
    await breadcrumb.getByText('Главная').click()
    await expect(page.getByText('База знаний AdCorp')).toBeVisible()
  })
})

test.describe('Search', () => {
  test('search finds articles', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Поиск по базе знаний...').fill('отпуск')
    await expect(page.getByText('Отпуска, отгулы, удалёнка')).toBeVisible()
  })

  test('search shows nothing found', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Поиск по базе знаний...').fill('xyznonexistent123')
    await expect(page.getByText(/Ничего не найдено/)).toBeVisible()
  })

  test('clicking search result opens article', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Поиск по базе знаний...').fill('зарплата')
    await page.getByText('Зарплата и выплаты').click()
    await expect(page.getByText('Ещё в этом разделе')).toBeVisible()
  })
})

test.describe('Chat Widget', () => {
  test('open and close chat', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Открыть AI-ассистент').click()
    await expect(page.getByText('AI-ассистент')).toBeVisible()
    await expect(page.getByText('Какой график работы?')).toBeVisible()

    await page.getByLabel('Свернуть чат').click()
    await expect(page.getByText('AI-ассистент')).not.toBeVisible()

    // Reopen — suggestions still there
    await page.getByLabel('Открыть AI-ассистент').click()
    await expect(page.getByText('Какой график работы?')).toBeVisible()
  })
})

test.describe('Mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('shows single column on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Новому сотруднику')).toBeVisible()
  })

  test('chat opens full width on mobile', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Открыть AI-ассистент').click()
    await expect(page.getByText('AI-ассистент')).toBeVisible()
  })
})
