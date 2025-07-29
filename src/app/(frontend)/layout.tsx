import '@/styles/app.css'
import './styles.css'

import React from 'react'

export const metadata = {
  description: 'MDV',
  title: 'MDV',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="fr">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
