export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <section className="container py-6 md:py-8">{children}</section>
}
