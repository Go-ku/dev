const leases = [
  {
    id: "LS-1001",
    property: "Roma Park Apartments #4",
    tenant: "Mwamba Zulu",
    landlord: "Chileshe Estates",
    monthlyRent: 15000,
    nextReview: "2025-02-01",
    expiresOn: "2025-08-01",
    status: "Active"
  },
  {
    id: "LS-1002",
    property: "Ibex Hill Villas #2",
    tenant: "Hope Banda",
    landlord: "Chileshe Estates",
    monthlyRent: 18000,
    nextReview: "2025-03-15",
    expiresOn: "2025-09-30",
    status: "Active"
  },
  {
    id: "LS-1003",
    property: "Kabulonga Offices #8",
    tenant: "Mulenga Logistics",
    landlord: "Northwind Ltd",
    monthlyRent: 25000,
    nextReview: "2025-01-20",
    expiresOn: "2025-04-30",
    status: "Ending"
  }
];

const payments = [
  {
    id: "PM-8801",
    tenant: "Mwamba Zulu",
    property: "Roma Park Apartments #4",
    amount: 15000,
    method: "Bank Transfer",
    date: "2024-11-05",
    status: "Confirmed"
  },
  {
    id: "PM-8802",
    tenant: "Hope Banda",
    property: "Ibex Hill Villas #2",
    amount: 18000,
    method: "Cash",
    date: "2024-11-08",
    status: "Pending"
  }
];

const reminders = [
  {
    id: "RM-7701",
    tenant: "Mulenga Logistics",
    type: "Invoice",
    dueDate: "2024-11-15",
    amount: 25000,
    channel: "Email"
  },
  {
    id: "RM-7702",
    tenant: "Hope Banda",
    type: "Reminder",
    dueDate: "2024-11-12",
    amount: 18000,
    channel: "SMS"
  }
];

const maintenanceTickets = [
  {
    id: "MT-6601",
    property: "Ibex Hill Villas #2",
    tenant: "Hope Banda",
    category: "Plumbing",
    priority: "High",
    status: "In Progress",
    createdAt: "2024-11-07",
    notes: "Pipe burst reported via tenant portal"
  },
  {
    id: "MT-6602",
    property: "Roma Park Apartments #4",
    tenant: "Mwamba Zulu",
    category: "Electrical",
    priority: "Medium",
    status: "New",
    createdAt: "2024-11-09",
    notes: "Kitchen lights flickering"
  },
  {
    id: "MT-6603",
    property: "Kabulonga Offices #8",
    tenant: "Mulenga Logistics",
    category: "Air Conditioning",
    priority: "Low",
    status: "New",
    createdAt: "2024-11-03",
    notes: "AC service due"
  }
];

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboardSummary() {
  await delay();
  return {
    totalUnits: 42,
    occupied: 38,
    arrearsZMW: 72000,
    maintenanceBacklog: maintenanceTickets.filter((ticket) => ticket.status !== "Resolved").length
  };
}

export async function fetchLeases() {
  await delay();
  return leases;
}

export async function fetchPayments() {
  await delay();
  return payments;
}

export async function fetchReminders() {
  await delay();
  return reminders;
}

export async function fetchMaintenanceTickets() {
  await delay();
  return maintenanceTickets;
}

export async function submitPayment(payment) {
  await delay();
  const newPayment = {
    ...payment,
    status: payment.status ?? "Pending",
    id: `PM-${Math.floor(Math.random() * 9000) + 1000}`
  };
  payments.unshift(newPayment);
  return newPayment;
}

export async function createReminder(reminder) {
  await delay();
  const newReminder = {
    ...reminder,
    id: `RM-${Math.floor(Math.random() * 9000) + 1000}`
  };
  reminders.unshift(newReminder);
  return newReminder;
}

export async function logMaintenanceTicket(ticket) {
  await delay();
  const newTicket = {
    ...ticket,
    status: ticket.status ?? "New",
    id: `MT-${Math.floor(Math.random() * 9000) + 1000}`,
    createdAt: new Date().toISOString().split("T")[0]
  };
  maintenanceTickets.unshift(newTicket);
  return newTicket;
}
