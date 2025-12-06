import { useState } from "react";
import { MainLayout } from "../../layout/MainLayout";
import { AddClientModal } from "../../components/AddClientModal";
import { getClients, type Client } from "../../storage/localDB";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

export function Clients() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(() => getClients());
  const navigate = useNavigate();

  // Atualiza lista sempre que fechar o modal
  function handleCloseModal() {
    setOpen(false);
    setClients(getClients());
  }

  return (
    <MainLayout>
      <AddButton onClick={() => setOpen(true)}>Adicionar Cliente</AddButton>

      <AddClientModal open={open} onClose={handleCloseModal} />

      <h2>Clientes cadastrados</h2>

      {clients.length === 0 && <p>Nenhum cliente cadastrado ainda.</p>}

      <ClientList>
        {clients.map((c) => (
          <ClientItem key={c.id}>
            <ClientLink to={`/clientes/${c.id}`}>
              <ClientInfo>
                <strong>{c.name}</strong>
                <span>{c.phone}</span>
                <span>{c.address}</span>
              </ClientInfo>
            </ClientLink>
            <ActionButtons>
              <ActionButton
                color="#6c63ff"
                onClick={() => navigate(`/clientes/${c.id}/edit`)}
              >
                Editar
              </ActionButton>
              <ActionButton
                color="#ff5e5e"
                onClick={() => {
                  if (confirm(`Deseja realmente deletar ${c.name}?`)) {
                    const updated = clients.filter((cl) => cl.id !== c.id);
                    localStorage.setItem(
                      "petshop_clients",
                      JSON.stringify(updated)
                    );
                    setClients(updated);
                  }
                }}
              >
                Deletar
              </ActionButton>
            </ActionButtons>
          </ClientItem>
        ))}
      </ClientList>
    </MainLayout>
  );
}

const ClientList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ClientItem = styled.li`
  background: ${({ theme }) => theme.background};
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  @media (min-width: 480px) {
    margin-top: 0;
  }
`;

const ActionButton = styled.button<{ color?: string }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${({ color }) => color || "#6c663ff"};
  color: #fff;
  font-weigth: bold;
  transition: 0.2s;

  &:hovr {
    filter: brightness(0.9);
  }
`;

const AddButton = styled.button`
  padding: 12px 18px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    opacity: 0.9;
  }
`;

const ClientLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  flex: 1;
`;
