import { MainLayout } from "../../layout/MainLayout";
import { getClients, type Client, type Pet } from "../../storage/localDB";
import { getNextBathDate, TODAY } from "../../utils/dateUtils";
import { useState, useEffect } from "react";
import styled from "styled-components";

interface BathAlert extends Pet {
  clientName: string;
  nextBathDate: string | null;
}

const AgendaContainer = styled.div`
  padding: 20px;
`;

const AgendaList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AgendaItem = styled.li<{ isLate: boolean }>`
 background-color: ${({ isLate }) => (isLate ? "#fee2e2" : "#f0f9ff")};
 border: 1px solid ${({ isLate }) => (isLate ? "#ef4444" : "#e0f2f1")};
border-left: 5px solid ${({ isLate }) => (isLate ? "#ef4444" : "#22c55e")};
 margin-bottom: 10px;
 padding: 15px;
 border-radius: 4px;
 box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const AlertTitle = styled.h3`
  margin-top: 0;
  color: #1f2937;
`;

export default function AgendaPage() {
  const [alerts, setAlerts] = useState<BathAlert[]>([]);

  useEffect(() => {
    // 1. Define a função de carregamento
    const loadAlerts = () => {
      // Assume que getClients retorna Client[]
      const clients: Client[] = getClients();
      const allAlerts: BathAlert[] = [];

      clients.forEach((client) => {
        client.pets.forEach((pet) => {
          // Filtra apenas pets com pacote ativo e último banho registrado
          if (pet.packageFrequency !== "none" && pet.lastBathDate) {
            // Obtém a próxima data sugerida
            const nextDate = getNextBathDate(
              pet.lastBathDate,
              pet.packageFrequency
            );

            // Adiciona o pet à lista se houver uma data sugerida
            if (nextDate) {
              allAlerts.push({
                ...pet,
                clientName: client.name,
                nextBathDate: nextDate,
              });
            }
          }
        });
      });
      // 2. Ordena por data mais próxima/atrasada
      allAlerts.sort((a, b) => {
        // Trata nulls (embora o 'if (nextDate)' acima já filtre, é bom ter)
        if (!a.nextBathDate) return 1;
        if (!b.nextBathDate) return -1;

        // Compara as datas (string YYYY-MM-DD)
        return a.nextBathDate.localeCompare(b.nextBathDate);
      });

      // 3. Atualiza o estado
      setAlerts(allAlerts);
    };

    // Executa a função na montagem
    loadAlerts();
  }, []);

  return (
    <MainLayout>
      <AgendaContainer>
        <h2>📅 Agendamentos de Banho Sugeridos</h2>
        <p>
          Lista de todos os pets com pacotes ativos, ordenados pela próxima data
          sugerida.
        </p>
        <p>
          Pets em<strong style={{ color: "#ef4444" }}>vermelho</strong> estão
          com o banho **Atrasado** (data sugerida já passou).
        </p>

        {alerts.length === 0 ? (
          <p>Nenhum pet com banho sugerido ou pacote ativo.</p>
        ) : (
          <AgendaList>
            {alerts.map((alert) => {
              if (!alert.nextBathDate) return null;

              // Verifica se a data sugerida é anterior à data de hoje (ATRASADO)
              const isLate = alert.nextBathDate < TODAY;
              // Formata a data para exibição PT-BR
              const formattedDate = new Date(
                alert.nextBathDate + "T00:00:00"
              ).toLocaleDateString("pt-BR");
              const formattedLastBath = alert.lastBathDate
                ? new Date(alert.lastBathDate + "T00:00:00").toLocaleDateString(
                    "pt-BR"
                  )
                : "N/A";
              return (
                <AgendaItem key={alert.id} isLate={isLate}>
                  <AlertTitle>
                    {alert.name} ({alert.breed}) -{" "}
                    {isLate ? "🚨 ATRASADO" : "🟢 Próximo"}
                  </AlertTitle>
                  <p>
                    Cliente: <strong>{alert.clientName}</strong>
                  </p>
                  <p>
                    Data Sugerida: <strong>{formattedDate}</strong>
                  </p>
                  <p>Último Banho: {formattedLastBath}</p>
                </AgendaItem>
              );
            })}
          </AgendaList>
        )}
      </AgendaContainer>
    </MainLayout>
  );
}
