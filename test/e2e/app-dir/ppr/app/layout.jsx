import React from 'react'
import Link from 'next/link'

const links = [
  { href: '/' },
  { href: '/no-suspense' },
  { href: '/suspense/node' },
  { href: '/suspense/edge' },
  { href: '/suspense/node/nested/1' },
]

export default function Root({ children }) {
  return (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
      </head>
      <body>
        <main className="prose my-6 mx-auto">
          <h1 id="page">Page</h1>
          {children}
          <h2>Links</h2>
          <ul>
            {links.map(({ href }) => (
              <li key={href}>
                <Link href={href}>{href}</Link>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  )
}
