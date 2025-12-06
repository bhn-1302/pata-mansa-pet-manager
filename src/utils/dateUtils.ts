import { type Pet } from "../storage/localDB";

// Obtém a data de hoje no formato YYYY-MM-DD (usada para comparação)
export const getLocalToday = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const TODAY = getLocalToday();

// Adiciona dias a uma data (YYYY-MM-DD)
export const addDays = (dateStr: string, days: number): string => {
  // Cria uma nova data para evitar modificar a original
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

// Obtém a próxima data de banho sugerida com a lógica de avanço
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

  const today = new Date(TODAY + "T00:00:00");
  let nextDate = addDays(lastBathDate, daysToAdd); // Avança o agendamento se a data sugerida já passou

  while (new Date(nextDate + "T00:00:00") < today) {
    nextDate = addDays(nextDate, daysToAdd);
  }
  return nextDate;
};

export const getPackageDurationDays = (
  frequency: Pet["packageFrequency"]
): number => {
  switch (frequency) {
    case "weekly":
      return 28; // 4 semanas
    case "bi-weekly":
      return 30; // ~1 mês
    case "monthly":
      return 30; // 1 mês
    default:
      return 30; // Padrão
  }
};

export const translatePackage = (
  frequency: Pet["packageFrequency"]
): string => {
  switch (frequency) {
    case "weekly":
      return "Semanal";
    case "bi-weekly":
      return "Quinzenal";
    case "monthly":
      return "Mensal";
    default:
      return "Nenhum";
  }
};

// Função utilitária para validação de data
export const isValidDate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr + "T00:00:00"); // Verifica se a data é válida e se os componentes correspondem ao input
  return date.toISOString().split("T")[0] === dateStr;
};
