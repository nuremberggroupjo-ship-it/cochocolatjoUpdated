export default async function AdminTemplate({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="animate-appear flex flex-1 flex-col gap-4 p-4">
      {children}
    </section>
  )
}
