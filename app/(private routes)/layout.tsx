export default function PrivateRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section style={{ padding: "2rem 0" }}>{children}</section>;
}
