import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const ROLE_DESCRIPTIONS = {
  admin: "Full system access",
  manager: "Payments, invoices, tenant onboarding",
  landlord: "Portfolio & cashflow visibility",
  maintenance: "Maintenance queue & updates",
  tenant: "Self-service portal"
};

export function describeRole(role) {
  return ROLE_DESCRIPTIONS[role] ?? "Team member";
}

export function canManageCashflow(role) {
  return role === "admin" || role === "manager";
}

export async function requireSession(roles = []) {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  if (roles.length > 0 && !roles.includes(session.user?.role)) {
    return null;
  }
  return session;
}
