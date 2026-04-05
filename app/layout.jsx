import './globals.css'

export const metadata = {
  title: 'База знаний AdCorp',
  description: 'Внутренний портал базы знаний для сотрудников AdCorp',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
