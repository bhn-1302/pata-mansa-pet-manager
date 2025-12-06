import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getClients, saveClients, type Client } from "../../storage/localDB";
import styled from "styled-components";

export default function EditClientPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Inicializa o form direto do localStorage
  const [formData, setFormData] = useState(() => {
    if (!id) return { name: "", phone: "", address: "" };
    const client = getClients().find((c) => c.id === id);
    return client
      ? { name: client.name, phone: client.phone, address: client.address }
      : { name: "", phone: "", address: "" };
  });

  // Se cliente não existe
  const clientExists = getClients().some((c) => c.id === id);
  if (!clientExists) return <p>Cliente não encontrado.</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      alert("Todos os campos (Nome, Telefone, Endereço) são obrigatórios.");
      return;
    }

    const clients = getClients();
    const updatedClients: Client[] = clients.map((c) =>
      c.id === id ? { ...c, ...formData } : c
    );

    saveClients(updatedClients);
    alert("Cliente atualizado!");
    navigate("/clientes");
  };

  return (
    <Container>
      <Title>Editar Cliente</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Nome:
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Label>
        <Label>
          Telefone:
          <Input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </Label>
        <Label>
          Endereço:
          <Input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </Label>
        <Button type="submit">Salvar</Button>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 24px;
  font-size: 28px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px 14px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #6c63ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const Button = styled.button`
  padding: 14px;
  border-radius: 8px;
  border: none;
  background-color: #6c63ff;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #574fd6;
  }
`;
