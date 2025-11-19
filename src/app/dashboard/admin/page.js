import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NavBar } from "@/components/layout/NavBar";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export const metadata = {
  title: "Dashboard · ZamReal"
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const allowedRoles = ["admin", "manager"];
  if (!allowedRoles.includes(session.user?.role)) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <NavBar user={session.user} />
      <AdminDashboard />
    </div>
  );
}
