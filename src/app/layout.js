import './globals.css'

export const metadata = {
  title: 'A&A Top Talent - Professional Talent Solutions',
  description: 'Advanced talent acquisition solutions for business professionals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
