export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
