import { useState } from "react";
import styled from "styled-components";
import { addClient, type Client } from "../storage/localDB";
import { v4 as uuid } from "uuid";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 32px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 16px;
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
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background-color: #6c63ff;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #574fd6;
  }
`;

export const AddClientModal = ({ open, onClose }: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  if (!open) return null;

  function handleSave() {
    if (!name.trim()) return;

    const newClient: Client = {
      id: uuid(),
      name,
      phone,
      address,
      pets: [],
    };

    addClient(newClient);

    setName("");
    setPhone("");
    onClose();
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3>Novo Cliente</h3>

        <Input
          placeholder="Nome do Cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Input
          placeholder="Endereço (Rua, Número, Bairro)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Button onClick={handleSave}>Salvar</Button>
      </Modal>
    </Overlay>
  );
};
