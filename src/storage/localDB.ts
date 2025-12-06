const CLIENTS_KEY = "petshop_clients";

export interface Pet {
  id: string;
  name: string;
  breed: string;
  packageFrequency: "weekly" | "bi-weekly" | "monthly" | "none"; // 'quinzenal' será 'bi-weekly'
  lastBathDate: string | null; // Último banho registrado (formato 'YYYY-MM-DD')
  renewalDate: string | null; // Data de renovação do pacote (formato 'YYYY-MM-DD')
  bathHistory: string[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  pets: Pet[];
}

export function getClients(): Client[] {
  const data = localStorage.getItem(CLIENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveClients(clients: Client[]) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function addClient(client: Client) {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
}

export function getClientById(id: string): Client | undefined {
  const clients = getClients();
  return clients.find((c) => c.id === id);
}

export function updateClient(updatedClient: Client) {
  const clients = getClients();
  const updatedClients = clients.map((c) =>
    c.id === updatedClient.id ? updatedClient : c
  );
  saveClients(updatedClients);
}

const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const getLocalToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const TODAY = getLocalToday();

export const getNextBathDate = (
  lastBathDate: string | null,
  frequency: Pet["packageFrequency"]
): string | null => {
  if (!lastBathDate || frequency === "none") return null;

  let daysToAdd = 0;

  switch (frequency) {
    case "weekly":
      daysToAdd = 7;
      break;
    case "bi-weekly":
      daysToAdd = 15;
      break;
    case "monthly":
      daysToAdd = 30;
      break;
    default:
      return null;
  }

  // Lógica de recalcular próxima data
  let nextDate = addDays(lastBathDate, daysToAdd);
  if (nextDate < TODAY) {
    let newDate = new Date(nextDate + "T00:00:00");
    const today = new Date(TODAY + "T00:00:00");
    while (newDate < today) {
      newDate = new Date(
        addDays(newDate.toISOString().split("T")[0], daysToAdd)
      );
    }
    nextDate = newDate.toISOString().split("T")[0];
  }

  return nextDate;
};

//Funções de resumo específicas para o Dashboard

export interface PetAlert extends Pet {
  clientName: string;
  clientId: string;
  alertType: "renewal_due" | "bath_overdue";
  dueDate?: string;
}

export function getDashboardAlerts(): PetAlert[] {
  const clients = getClients();
  const alerts: PetAlert[] = [];

  clients.forEach((client) => {
    client.pets.forEach((pet) => {
      const isRenewalDue = pet.renewalDate && pet.renewalDate <= TODAY;
      const hasPackage = pet.packageFrequency !== "none";

      // 1. Alerta de Renovação Vencida
      if (isRenewalDue) {
        alerts.push({
          ...pet,
          clientName: client.name,
          clientId: client.id,
          alertType: "renewal_due",
          dueDate: pet.renewalDate || undefined,
        });
      }

      // 2. Alerta de Banho Atrasado (se tiver pacote e a data sugerida já tiver passado)
      if (hasPackage && pet.lastBathDate) {
        const nextBathDate = getNextBathDate(
          pet.lastBathDate,
          pet.packageFrequency
        );

        // Se a data sugerida já passou, o banho está atrasado
        if (nextBathDate && nextBathDate < TODAY) {
          alerts.push({
            ...pet,
            clientName: client.name,
            clientId: client.id,
            alertType: "bath_overdue",
            dueDate: nextBathDate,
          });
        }
      }
    });
  });

  return alerts;
}

export function getDashboardStats() {
  const clients = getClients();
  const totalClients = clients.length;
  let totalPets = 0;

  clients.forEach((client) => {
    totalPets += client.pets.length;
  });

  return { totalClients, totalPets };
}
