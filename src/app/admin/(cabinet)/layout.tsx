import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminCabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminNav />
      <main className="admin-main">{children}</main>
    </>
  );
}
