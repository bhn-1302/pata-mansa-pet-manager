import { MainLayout } from "../../layout/MainLayout";
import styled from "styled-components";
import {
  getDashboardAlerts,
  getDashboardStats,
  type PetAlert,
} from "../../storage/localDB";
import { Link } from "react-router-dom";
import { useState } from "react";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  cursor: default;
`;

const StatCard = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
  cursor: default;
  cursor: default;
`;

const CardValue = styled.h2`
  font-size: 32px;
  margin: 8px 0 0;
  cursor: default;
`;

const AlertList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertItem = styled.li<{ type: "renewal_due" | "bath_overdue" }>`
  background: ${({ theme }) => theme.background};
  border-left: 5px solid
    ${({ type }) => (type === "renewal_due" ? "#EF4444" : "#F59E0B")};
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
`;

const PetInfo = styled.div`
  display: flex;
  flex-direction: column;
  cursor: default;
`;

const AlertLink = styled(Link)`
  text-decoration: none;
  color: #6c63ff;
  font-weight: bold;
  font-size: 14px;
  transition: 0.2s;
  &:hover {
    text-decoration: underline;
  }
`;

const RefreshButton = styled.button`
  padding: 10px 15px;
  background-color: #f59e0b;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: 0.2s;

  &:hover {
    background-color: #d97706;
  }
`;

export const Dashboard = () => {
  const [stats, setStats] = useState(getDashboardStats);
  const [alerts, setAlerts] = useState<PetAlert[]>(getDashboardAlerts);

  // Função para recarregar todos os dados do LocalStorage
  const refreshDashboard = () => {
    setStats(getDashboardStats());
    setAlerts(getDashboardAlerts());
    alert("Dados do Dashboard recarregados com sucesso!");
  };

  const totalAlerts = alerts.length;
  const renewalAlerts = alerts.filter(
    (a) => a.alertType === "renewal_due"
  ).length;
  const overdueBathAlerts = alerts.filter(
    (a) => a.alertType === "bath_overdue"
  ).length;

  const translatePackage = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "Semanal";
      case "bi-weekly":
        return "Quinzenal";
      case "monthly":
        return "Mensal";
      default:
        return "N/A";
    }
  };

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard 🏠</h1>
        <RefreshButton onClick={refreshDashboard}>
          🔄 Recarregar Dados
        </RefreshButton>
      </div>
      <hr />

      <h2>Resumo Geral</h2>
      <StatsGrid>
        <StatCard color="#3B82F6">
          <CardTitle>Total de Clientes</CardTitle>
          <CardValue>{stats.totalClients}</CardValue>
        </StatCard>
        <StatCard color="#10B981">
          <CardTitle>Total de Pets</CardTitle>
          <CardValue>{stats.totalPets}</CardValue>
        </StatCard>
        <StatCard color="#EF4444">
          <CardTitle>Total de Alertas</CardTitle>
          <CardValue>{totalAlerts}</CardValue>
        </StatCard>
      </StatsGrid>

      <hr />

      <h2>🚨 Itens Pendentes de Atenção ({totalAlerts})</h2>
      <p>
        Pacotes Vencidos: <strong>{renewalAlerts}</strong> | Banhos Atrasados:{" "}
        <strong>{overdueBathAlerts}</strong>
      </p>

      {totalAlerts === 0 ? (
        <p>🎉 Nenhum alerta pendente. Ótimo trabalho!</p>
      ) : (
        <AlertList>
          {alerts.map((alert) => (
            <AlertItem key={alert.id} type={alert.alertType}>
              <PetInfo>
                <strong>{alert.name}</strong>
                <span>Cliente: {alert.clientName}</span>
                <span>Pacote: {translatePackage(alert.packageFrequency)}</span>
              </PetInfo>
              <div>
                {alert.alertType === "renewal_due" ? (
                  <>
                    🔔 **RENOVAÇÃO VENCIDA**
                    <small>
                      {" "}
                      (Desde{" "}
                      {new Date(
                        alert.dueDate! + "T00:00:00"
                      ).toLocaleDateString("pt-BR")}
                      )
                    </small>
                  </>
                ) : (
                  <>
                    🛁 **BANHO ATRASADO**
                    <small>
                      {" "}
                      (Último sugerido:{" "}
                      {new Date(
                        alert.dueDate! + "T00:00:00"
                      ).toLocaleDateString("pt-BR")}
                      )
                    </small>
                  </>
                )}
                <AlertLink to={`/clientes/${alert.clientId}`}>
                  Ver Detalhes
                </AlertLink>
              </div>
            </AlertItem>
          ))}
        </AlertList>
      )}
    </MainLayout>
  );
};
