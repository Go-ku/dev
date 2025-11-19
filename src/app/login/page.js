import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in · ZamReal"
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard/admin");
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-500">ZamReal</p>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">
          Sign in with your company email to manage leases, payments and maintenance requests.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
