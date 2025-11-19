import { LogoutButton } from "@/components/auth/LogoutButton";
import { describeRole } from "@/lib/auth-utils";

export function NavBar({ user }) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-500">ZamReal</p>
        <h1 className="text-2xl font-semibold text-slate-900">Zambia real estate cockpit</h1>
        <p className="text-sm text-slate-500">{describeRole(user?.role)}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
