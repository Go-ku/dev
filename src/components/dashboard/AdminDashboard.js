"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReminder,
  fetchDashboardSummary,
  fetchLeases,
  fetchMaintenanceTickets,
  fetchPayments,
  fetchReminders,
  logMaintenanceTicket,
  submitPayment
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { format } from "date-fns";
import { AlertCircle, Bell, Building2, Hammer, Receipt, Users } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

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

export function AdminDashboard() {
  const { summary, leases, payments, reminders, maintenance } = useDashboardData();
  const queryClient = useQueryClient();

  const [paymentForm, setPaymentForm] = useState({
    tenant: "Mwamba Zulu",
    property: "Roma Park Apartments #4",
    amount: "15000",
    method: "Bank Transfer",
    date: new Date().toISOString().split("T")[0]
  });

  const [reminderForm, setReminderForm] = useState({
    tenant: "Hope Banda",
    type: "Invoice",
    dueDate: new Date().toISOString().split("T")[0],
    amount: "18000",
    channel: "SMS"
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    property: "Ibex Hill Villas #2",
    tenant: "Hope Banda",
    category: "Plumbing",
    priority: "High",
    notes: "",
    status: "New"
  });

  const paymentMutation = useMutation({
    mutationFn: submitPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] })
  });

  const reminderMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] })
  });

  const maintenanceMutation = useMutation({
    mutationFn: logMaintenanceTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["maintenance"] })
  });

  const leaseColumns = useMemo(
    () => [
      { header: "Property", accessorKey: "property" },
      { header: "Tenant", accessorKey: "tenant" },
      {
        header: "Monthly Rent",
        accessorKey: "monthlyRent",
        cell: ({ getValue }) => <span>{currency(getValue())}</span>
      },
      {
        header: "Next Review",
        accessorKey: "nextReview",
        cell: ({ getValue }) => format(new Date(getValue()), "d MMM")
      },
      {
        header: "Lease Ends",
        accessorKey: "expiresOn",
        cell: ({ getValue }) => format(new Date(getValue()), "d MMM yyyy")
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const value = getValue();
          const variant = value === "Active" ? "success" : value === "Ending" ? "warning" : "danger";
          return <Badge variant={variant}>{value}</Badge>;
        }
      }
    ],
    []
  );

  const leaseTable = useReactTable({
    data: leases.data ?? [],
    columns: leaseColumns,
    getCoreRowModel: getCoreRowModel()
  });

  const prioritizedTickets = useMemo(() => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return [...(maintenance.data ?? [])].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [maintenance.data]);

  const upcomingReviews = (leases.data ?? []).filter((lease) => {
    const reviewDate = new Date(lease.nextReview);
    const now = new Date();
    const diff = reviewDate.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 90 && days >= -30;
  });

  const reminderTabs = (
    <Tabs
      defaultTab="reminders"
      items={[
        {
          id: "reminders",
          label: "Rent reminders",
          content: (
            <Table>
              <THead>
                <TR>
                  <TH>Tenant</TH>
                  <TH>Due</TH>
                  <TH>Amount</TH>
                  <TH>Channel</TH>
                </TR>
              </THead>
              <TBody>
                {(reminders.data ?? []).map((reminder) => (
                  <TR key={reminder.id}>
                    <TD>{reminder.tenant}</TD>
                    <TD>{format(new Date(reminder.dueDate), "d MMM")}</TD>
                    <TD>{currency(reminder.amount)}</TD>
                    <TD>{reminder.channel}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )
        },
        {
          id: "payments",
          label: "Recent payments",
          content: (
            <Table>
              <THead>
                <TR>
                  <TH>Tenant</TH>
                  <TH>Property</TH>
                  <TH>Amount</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {(payments.data ?? []).map((payment) => (
                  <TR key={payment.id}>
                    <TD>{payment.tenant}</TD>
                    <TD>{payment.property}</TD>
                    <TD>{currency(payment.amount)}</TD>
                    <TD>
                      <Badge variant={payment.status === "Confirmed" ? "success" : "warning"}>
                        {payment.status}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )
        }
      ]}
    />
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-500">ZamReal Manager</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              End-to-end property operations built for Zambia
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Track rent, leases, maintenance and landlord communications from a single minimalist workspace.
              Optimised for mobile teams but delightful on desktop too.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">System admin:</span> full access to everything.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Managers:</span> register tenants, log payments, create invoices & reminders.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Landlords:</span> read-only view of leases, arrears and maintenance.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Maintenance crew:</span> live queue, priority tags and job notes.
            </p>
            <p>
              <span className="font-semibold text-slate-900">Tenants:</span> mobile-friendly payment receipts, lease info and service desk.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Users,
            label: "Occupied units",
            value: `${summary.data?.occupied ?? "--"}/${summary.data?.totalUnits ?? "--"}`
          },
          {
            icon: Receipt,
            label: "Rent arrears",
            value: summary.data ? currency(summary.data.arrearsZMW) : "--"
          },
          {
            icon: Bell,
            label: "Pending reminders",
            value: reminders.data?.length ?? "--"
          },
          {
            icon: Hammer,
            label: "Maintenance backlog",
            value: summary.data?.maintenanceBacklog ?? "--"
          }
        ].map((item) => (
          <Card key={item.label} className="flex items-center gap-4">
            <div className="rounded-2xl bg-slate-900/90 p-3 text-white">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Log payments & issue receipts</CardTitle>
              <CardDescription>
                Managers can capture payments on behalf of tenants, auto-tag landlord share and send branded receipts.
              </CardDescription>
            </div>
            <Receipt className="text-brand-500" />
          </CardHeader>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              paymentMutation.mutate({
                tenant: paymentForm.tenant,
                property: paymentForm.property,
                amount: Number(paymentForm.amount),
                method: paymentForm.method,
                date: paymentForm.date,
                status: "Confirmed"
              });
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="tenant">Tenant</Label>
              <Input
                id="tenant"
                value={paymentForm.tenant}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, tenant: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="property">Property</Label>
              <Input
                id="property"
                value={paymentForm.property}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, property: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">Amount (ZMW)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentForm.amount}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="method">Payment method</Label>
              <Select
                id="method"
                value={paymentForm.method}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, method: event.target.value }))}
              >
                <option value="Bank Transfer">Bank transfer</option>
                <option value="Mobile Money">Mobile money</option>
                <option value="Cash">Cash</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="date">Payment date</Label>
              <Input
                id="date"
                type="date"
                value={paymentForm.date}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, date: event.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button type="submit" disabled={paymentMutation.isLoading}>
                {paymentMutation.isLoading ? "Saving..." : "Log payment & send receipt"}
              </Button>
              <p className="text-xs text-slate-500">Receipts are shared instantly by SMS/email.</p>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Issue invoices & reminders</CardTitle>
              <CardDescription>Trigger polite nudges or full invoices in seconds.</CardDescription>
            </div>
            <Bell className="text-brand-500" />
          </CardHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              reminderMutation.mutate({
                tenant: reminderForm.tenant,
                type: reminderForm.type,
                dueDate: reminderForm.dueDate,
                amount: Number(reminderForm.amount),
                channel: reminderForm.channel
              });
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="rem-tenant">Tenant</Label>
              <Input
                id="rem-tenant"
                value={reminderForm.tenant}
                onChange={(event) => setReminderForm((prev) => ({ ...prev, tenant: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rem-type">Type</Label>
              <Select
                id="rem-type"
                value={reminderForm.type}
                onChange={(event) => setReminderForm((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="Invoice">Invoice</option>
                <option value="Reminder">Reminder</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="rem-date">Due date</Label>
              <Input
                id="rem-date"
                type="date"
                value={reminderForm.dueDate}
                onChange={(event) => setReminderForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rem-amount">Amount (ZMW)</Label>
              <Input
                id="rem-amount"
                type="number"
                value={reminderForm.amount}
                onChange={(event) => setReminderForm((prev) => ({ ...prev, amount: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rem-channel">Channel</Label>
              <Select
                id="rem-channel"
                value={reminderForm.channel}
                onChange={(event) => setReminderForm((prev) => ({ ...prev, channel: event.target.value }))}
              >
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
              </Select>
            </div>
            <Button type="submit" disabled={reminderMutation.isLoading}>
              {reminderMutation.isLoading ? "Sending..." : "Send invoice/reminder"}
            </Button>
          </form>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Lease tracking & rent review radar</CardTitle>
              <CardDescription>
                Automatically flag contracts that need renewal or an annual rent increment.
              </CardDescription>
            </div>
            <Building2 className="text-brand-500" />
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                {leaseTable.getHeaderGroups().map((headerGroup) => (
                  <TR key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TH key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TH>
                    ))}
                  </TR>
                ))}
              </THead>
              <TBody>
                {leaseTable.getRowModel().rows.map((row) => (
                  <TR key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TD key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TD>
                    ))}
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Upcoming rent increases</CardTitle>
              <CardDescription>Managers receive nudges 90 days before review.</CardDescription>
            </div>
            <AlertCircle className="text-brand-500" />
          </CardHeader>
          <div className="space-y-4">
            {upcomingReviews.length === 0 && (
              <p className="text-sm text-slate-500">No rent reviews within the next quarter.</p>
            )}
            {upcomingReviews.map((lease) => (
              <div key={lease.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{lease.property}</p>
                    <p className="text-xs text-slate-500">{lease.tenant}</p>
                  </div>
                  <Badge variant="warning">{format(new Date(lease.nextReview), "d MMM")}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Current rent {currency(lease.monthlyRent)} · Proposed uplift reminder sent to landlord.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Log maintenance & prioritise jobs</CardTitle>
              <CardDescription>Accept tenant requests, escalate emergencies and keep crews aligned.</CardDescription>
            </div>
            <Hammer className="text-brand-500" />
          </CardHeader>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              maintenanceMutation.mutate({
                property: maintenanceForm.property,
                tenant: maintenanceForm.tenant,
                category: maintenanceForm.category,
                priority: maintenanceForm.priority,
                status: maintenanceForm.status,
                notes: maintenanceForm.notes
              });
            }}
          >
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="maint-notes">Issue notes</Label>
              <Textarea
                id="maint-notes"
                rows={3}
                placeholder="Eg. Burst geyser in Roma Park bathroom"
                value={maintenanceForm.notes}
                onChange={(event) => setMaintenanceForm((prev) => ({ ...prev, notes: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maint-property">Property</Label>
              <Input
                id="maint-property"
                value={maintenanceForm.property}
                onChange={(event) => setMaintenanceForm((prev) => ({ ...prev, property: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maint-tenant">Tenant</Label>
              <Input
                id="maint-tenant"
                value={maintenanceForm.tenant}
                onChange={(event) => setMaintenanceForm((prev) => ({ ...prev, tenant: event.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maint-category">Category</Label>
              <Select
                id="maint-category"
                value={maintenanceForm.category}
                onChange={(event) => setMaintenanceForm((prev) => ({ ...prev, category: event.target.value }))}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Security">Security</option>
                <option value="Air Conditioning">Air conditioning</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="maint-priority">Priority</Label>
              <Select
                id="maint-priority"
                value={maintenanceForm.priority}
                onChange={(event) => setMaintenanceForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="maint-status">Status</Label>
              <Select
                id="maint-status"
                value={maintenanceForm.status}
                onChange={(event) => setMaintenanceForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Select>
            </div>
            <div className="flex flex-col justify-end">
              <Button type="submit" disabled={maintenanceMutation.isLoading}>
                {maintenanceMutation.isLoading ? "Saving..." : "Log maintenance"}
              </Button>
            </div>
          </form>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Prioritised field queue</CardTitle>
              <CardDescription>Maintenance crew sees oldest & highest priority first.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {prioritizedTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{ticket.property}</p>
                    <p className="text-xs text-slate-500">{ticket.tenant}</p>
                  </div>
                  <Badge
                    variant={
                      ticket.priority === "High"
                        ? "danger"
                        : ticket.priority === "Medium"
                        ? "warning"
                        : "info"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{ticket.category}</p>
                <p className="text-xs text-slate-400">Logged {format(new Date(ticket.createdAt), "d MMM")}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Receivables & reminders</CardTitle>
              <CardDescription>Switch between outstanding reminders and recorded payments.</CardDescription>
            </div>
          </CardHeader>
          {reminderTabs}
        </Card>
      </section>
    </div>
  );
}
