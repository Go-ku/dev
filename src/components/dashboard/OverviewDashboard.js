"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardSummary,
  fetchLeases,
  fetchMaintenanceTickets,
  fetchPayments,
  fetchReminders
} from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { format } from "date-fns";
import { AlertCircle, Bell, Building2, Hammer, Receipt, Users } from "lucide-react";

const currency = (value = 0) =>
  new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(value);

function useDashboardData() {
  const summary = useQuery({ queryKey: ["summary"], queryFn: fetchDashboardSummary });
  const leases = useQuery({ queryKey: ["leases"], queryFn: fetchLeases });
  const payments = useQuery({ queryKey: ["payments"], queryFn: fetchPayments });
  const reminders = useQuery({ queryKey: ["reminders"], queryFn: fetchReminders });
  const maintenance = useQuery({ queryKey: ["maintenance"], queryFn: fetchMaintenanceTickets });
  return { summary, leases, payments, reminders, maintenance };
}

function SummaryCard({ title, value, description, icon: Icon }) {
  return (
    <Card className="border-slate-100 bg-white/80 shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewDashboard() {
  const { summary, leases, payments, reminders, maintenance } = useDashboardData();

  const occupancyRate = useMemo(() => {
    if (!summary.data?.totalUnits) return 0;
    return Math.round((summary.data.occupied / summary.data.totalUnits) * 100);
  }, [summary.data]);

  const upcomingReviews = useMemo(() => {
    return (leases.data ?? [])
      .filter((lease) => new Date(lease.nextReview).getTime() >= Date.now())
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
      .slice(0, 5);
  }, [leases.data]);

  const prioritizedTickets = useMemo(() => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return (maintenance.data ?? []).sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 5);
  }, [maintenance.data]);

  const recentPayments = (payments.data ?? []).slice(0, 4);
  const rentReminders = (reminders.data ?? []).slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total units"
          value={summary.data?.totalUnits ?? "—"}
          description={`${summary.data?.occupied ?? 0} occupied`}
          icon={Building2}
        />
        <SummaryCard
          title="Occupancy"
          value={`${occupancyRate}%`}
          description="Portfolio occupancy rate"
          icon={Users}
        />
        <SummaryCard
          title="Arrears"
          value={currency(summary.data?.arrearsZMW ?? 0)}
          description="Outstanding rent"
          icon={Receipt}
        />
        <SummaryCard
          title="Maintenance"
          value={`${summary.data?.maintenanceBacklog ?? 0} open`}
          description="Tickets awaiting action"
          icon={Hammer}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-slate-100 bg-white/80 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Lease activity</CardTitle>
            <CardDescription>Upcoming reviews to prepare for</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <TR>
                  <TH>Property</TH>
                  <TH>Tenant</TH>
                  <TH>Next review</TH>
                  <TH>Monthly rent</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {upcomingReviews.map((lease) => (
                  <TR key={lease.id}>
                    <TD>{lease.property}</TD>
                    <TD>{lease.tenant}</TD>
                    <TD>{format(new Date(lease.nextReview), "d MMM yyyy")}</TD>
                    <TD>{currency(lease.monthlyRent)}</TD>
                    <TD>
                      <Badge variant={lease.status === "Active" ? "success" : "warning"}>{lease.status}</Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {!upcomingReviews.length && (
              <p className="py-6 text-center text-sm text-slate-500">No upcoming reviews in the next 90 days.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-100 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>Latest rent reminders and payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Bell className="h-4 w-4 text-brand-500" />
                Rent reminders
              </div>
              <div className="space-y-2">
                {rentReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{reminder.tenant}</p>
                      <p className="text-xs text-slate-500">
                        Due {format(new Date(reminder.dueDate), "d MMM")} · {reminder.channel}
                      </p>
                    </div>
                    <Badge>{currency(reminder.amount)}</Badge>
                  </div>
                ))}
                {!rentReminders.length && <p className="text-sm text-slate-500">No reminders sent yet.</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Receipt className="h-4 w-4 text-brand-500" />
                Recent payments
              </div>
              <div className="space-y-2">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{payment.tenant}</p>
                      <p className="text-xs text-slate-500">
                        {payment.property} · {format(new Date(payment.date), "d MMM")}
                      </p>
                    </div>
                    <Badge variant={payment.status === "Confirmed" ? "success" : "warning"}>{payment.status}</Badge>
                  </div>
                ))}
                {!recentPayments.length && <p className="text-sm text-slate-500">No payments received.</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 bg-white/80 shadow-sm">
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
          <CardDescription>Prioritized tickets to assign today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {prioritizedTickets.map((ticket) => (
              <div key={ticket.id} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mt-1">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{ticket.property}</p>
                    <Badge variant={ticket.priority === "High" ? "danger" : ticket.priority === "Medium" ? "warning" : "neutral"}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{ticket.tenant} · {ticket.category}</p>
                  <p className="text-xs text-slate-500">Opened {format(new Date(ticket.createdAt), "d MMM")}</p>
                  <Badge variant={ticket.status === "Resolved" ? "success" : "warning"}>{ticket.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          {!prioritizedTickets.length && <p className="py-6 text-center text-sm text-slate-500">No open maintenance tickets.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
