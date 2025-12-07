import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MainLayout } from "../../layout/MainLayout";
import {
  getClientById,
  updateClient,
  type Client,
  type Pet,
  updatePetImage,
} from "../../storage/localDB";
import { v4 as uuid } from "uuid";
import {
  Header,
  Title,
  EditLink,
  ClientInfo,
  Divider,
  Form,
  Input,
  Select,
  Button,
  PetList,
  PetItem,
  PetContainer,
  PetImage,
  PetInfo,
  ActionButtons,
  ActionButton,
  RemoveButton,
  RenewalAlert,
} from "./ClientDetailsStyles";
import {
  TODAY,
  getNextBathDate,
  getPackageDurationDays,
  translatePackage,
  isValidDate,
  addDays,
} from "../../utils/dateUtils";
import { fileToBase64 } from "../../utils/fileUtils";

export default function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchClient = () => {
    if (!id) return null;
    const clientFound = getClientById(id);

    return clientFound || null;
  };

  const [client, setClient] = useState<Client | null>(fetchClient);
  const [newPetName, setNewPetName] = useState("");
  const [newPetBreed, setNewPetBreed] = useState("");
  const [newPetFrequency, setNewPetFrequency] =
    useState<Pet["packageFrequency"]>("none");
  const [newPetImage, setNewPetImage] = useState<string | null>(null);

  if (!client) {
    return (
      <MainLayout>
        <p>Cliente não encontrado.</p>
        <Button onClick={() => navigate("/clientes")}>
          Voltar para Clientes
        </Button>
      </MainLayout>
    );
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64String = await fileToBase64(file);
      setNewPetImage(base64String);
    } else {
      setNewPetImage(null);
    }
  };

  // Função para adicionar um novo pet
  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim() || !newPetBreed.trim()) {
      alert("Nome e Raça do Pet são obrigatórios.");
      return;
    }

    const packageDuration = getPackageDurationDays(newPetFrequency);
    const initialRenewalDate = addDays(TODAY, packageDuration);

    const newPet: Pet = {
      id: uuid(),
      name: newPetName,
      breed: newPetBreed,
      packageFrequency: newPetFrequency,
      lastBathDate: null,
      renewalDate: initialRenewalDate,
      bathHistory: [],
      imageBase64: newPetImage,
    };

    const updatedClient = {
      ...client,
      pets: [...client.pets, newPet],
    };

    updateClient(updatedClient);
    setClient(updatedClient); // Atualiza o estado local
    setNewPetName("");
    setNewPetBreed("");
    setNewPetFrequency("none");
    setNewPetImage(null);
  };

  // Função para atualizar a foto de um pet existente
  const handleUpdatePetImage = async (
    petToUpdateId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file && client) {
      const newImageBase64 = await fileToBase64(file);

      if (newImageBase64) {
        const updatedClient = updatePetImage(
          client.id,
          petToUpdateId,
          newImageBase64
        );

        // Define o novo estado com o cliente que a função já salvou no localStorage
        setClient(updatedClient);

        alert(`Foto do pet atualizada com sucesso!`);
      }
    }
  };

  const handleMarkBath = (petToUpdate: Pet) => {
    const bathDateInput = prompt(
      `Digite a data REAL em que o banho de ${petToUpdate.name} foi realizado (Ex: ${TODAY}):`
    );

    // 1. Validação
    if (!bathDateInput) {
      alert("Operação cancelada ou data inválida.");
      return;
    }

    if (!isValidDate(bathDateInput)) {
      alert("Data inválida! Por favor, use o formato YYYY-MM-DD.");
      return;
    }

    const updatedPet: Pet = {
      ...petToUpdate,
      lastBathDate: bathDateInput,
      bathHistory: [...petToUpdate.bathHistory, bathDateInput],
    };

    const updatedClients: Client = {
      ...client,
      pets: client.pets.map((p) => (p.id === petToUpdate.id ? updatedPet : p)),
    };

    updateClient(updatedClients);
    setClient(updatedClients);

    const nextBathDate = getNextBathDate(
      bathDateInput,
      petToUpdate.packageFrequency
    );
    const clientName = client.name;
    const translatedPackage = translatePackage(petToUpdate.packageFrequency);

    // Formata datas
    const formattedBathDate = new Date(
      bathDateInput + "T00:00:00"
    ).toLocaleDateString("pt-BR");
    const formattedNextBathDate = nextBathDate
      ? new Date(nextBathDate + "T00:00:00").toLocaleDateString("pt-BR")
      : "N/A";
    const formattedRenewalDate = petToUpdate.renewalDate
      ? new Date(petToUpdate.renewalDate + "T00:00:00").toLocaleDateString(
          "pt-BR"
        )
      : "N/A";

    // 3. CRIA O TEXTO DA MENSAGEM (Incluindo Endereço, Pacote e Renovação)
    const messageTemplate = `
Olá, ${clientName}!

Temos uma ótima notícia! O banho do seu pet ${petToUpdate.name} foi concluído com sucesso no dia ${formattedBathDate}.
Próximo banho sugerido: ${formattedNextBathDate}

Renovação do pacote (${translatedPackage}): prevista para ${formattedRenewalDate}
Antes de finalizar, gostaríamos de confirmar se este é o seu endereço correto:

${client.address}
Caso precise ajustar alguma informação, é só nos avisar!
Muito obrigado(a) pela confiança!
Atenciosamente, Pata Mansa Pet Shop.
    `.trim();

    // Remove caracteres não numéricos do telefone e codifica a URL
    const phone = client.phone.replace(/\D/g, "");
    const message = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/55${phone}?text=${message}`;

    alert(
      `Banho de ${petToUpdate.name} marcado para ${formattedBathDate}!\nAbrindo WhatsApp para enviar a confirmação...`
    );
    window.open(whatsappUrl, "_blank");
  };

  // Função para renovar o pacote
  const handleRenewPackage = (petToUpdate: Pet) => {
    if (
      !confirm(
        `Deseja renovar o pacote de ${petToUpdate.name} por mais 30 dias?`
      )
    )
      return;

    const packageDuration = getPackageDurationDays(
      petToUpdate.packageFrequency
    );

    const newRenewalDate = addDays(TODAY, packageDuration);

    const updatedPet: Pet = {
      ...petToUpdate,
      renewalDate: newRenewalDate,
    };

    const updatedClients: Client = {
      ...client,
      pets: client.pets.map((p) => (p.id === petToUpdate.id ? updatedPet : p)),
    };

    updateClient(updatedClients);
    setClient(updatedClients);
    alert(`Pacote de ${petToUpdate.name} renovado até ${newRenewalDate}.`);
  };

  const handleChangePackage = (petToUpdate: Pet) => {
    const newFrequency = prompt(
      `Selecione o novo pacote para ${petToUpdate.name} (Atual: ${petToUpdate.packageFrequency}):\n1: Semanal\n2: Quinzenal\n3: Mensal\n4: Nenhum`
    );

    let newPackage: Pet["packageFrequency"] = petToUpdate.packageFrequency;
    let newRenewalDate = petToUpdate.renewalDate;

    switch (newFrequency) {
      case "1":
        newPackage = "weekly";
        break;
      case "2":
        newPackage = "bi-weekly";
        break;
      case "3":
        newPackage = "monthly";
        break;
      case "4":
        newPackage = "none";
        break;
      default:
        alert("Seleção inválida. Nenhuma alteração realizada.");
        return;
    }

    // Recalcula a data de renovação com base na nova frequência
    if (newPackage !== petToUpdate.packageFrequency) {
      if (newPackage !== "none") {
        const packageDuration = getPackageDurationDays(newPackage);
        // Sugere que o pacote renovado comece hoje com a nova duração
        newRenewalDate = addDays(TODAY, packageDuration);
      } else {
        newRenewalDate = null;
      }

      const updatedPet: Pet = {
        ...petToUpdate,
        packageFrequency: newPackage,
        renewalDate: newRenewalDate,
      };

      const updatedClients: Client = {
        ...client,
        pets: client.pets.map((p) =>
          p.id === petToUpdate.id ? updatedPet : p
        ),
      };

      updateClient(updatedClients);
      setClient(updatedClients);
      alert(
        `Pacote de ${
          petToUpdate.name
        } alterado para ${newPackage} e renovação definida para ${
          newRenewalDate || "N/A"
        }.`
      );
    }
  };

  // Função para remover um pet
  const handleRemovePet = (petId: string) => {
    if (!confirm("Tem certeza que deseja remover este pet?")) return;

    const updatedPets = client.pets.filter((pet) => pet.id !== petId);
    const updatedClient = {
      ...client,
      pets: updatedPets,
    };

    updateClient(updatedClient);
    setClient(updatedClient);
  };

  return (
    <MainLayout>
      <Header>
        <Title>Detalhes do Cliente: {client.name}</Title>
        <EditLink onClick={() => navigate(`/clientes/${client.id}/edit`)}>
          Editar Cliente
        </EditLink>
      </Header>

      <ClientInfo>
        <p>
          <strong>Telefone:</strong> {client.phone}
        </p>
        <p>
          <strong>Endereço:</strong> {client.address}
        </p>
        <p>
          <strong>Pets Cadastrados:</strong> {client.pets.length}
        </p>
      </ClientInfo>

      <Divider />

      <h2>Cadastrar Novo Pet</h2>
      <Form onSubmit={handleAddPet}>
        <Input
          type="text"
          placeholder="Nome do Pet"
          value={newPetName}
          onChange={(e) => setNewPetName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Raça do Pet"
          value={newPetBreed}
          onChange={(e) => setNewPetBreed(e.target.value)}
        />

        {/*CAMPO DE FOTO NO CADASTRO */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "0.9em" }}>Foto:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <Select
          value={newPetFrequency}
          onChange={(e) =>
            setNewPetFrequency(e.target.value as Pet["packageFrequency"])
          }
        >
          <option value="none">Selecione o Pacote</option>
          <option value="weekly">Semanal</option>
          <option value="bi-weekly">Quinzenal</option>
          <option value="monthly">Mensal</option>
        </Select>
        <Button type="submit">Adicionar Pet</Button>
      </Form>

      <Divider />

      <h2>Pets de {client.name}</h2>
      {client.pets.length === 0 ? (
        <p>Nenhum pet cadastrado para este cliente.</p>
      ) : (
        <PetList>
          {client.pets.map((pet) => {
            const nextBathDate = getNextBathDate(
              pet.lastBathDate,
              pet.packageFrequency
            );
            const isRenewalDue = pet.renewalDate && pet.renewalDate <= TODAY;

            return (
              <PetItem key={pet.id}>
                <PetContainer>
                  {/* Exibe a imagem */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <PetImage
                      src={
                        pet.imageBase64 ||
                        "https://via.placeholder.com/80?text=Pet"
                      }
                      alt={pet.name}
                    />
                    {/*CAMPO DE ATUALIZAÇÃO DE FOTO */}
                    <label
                      htmlFor={`upload-${pet.id}`}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.8em",
                        marginTop: "5px",
                        color: "#3b82f6",
                        fontWeight: "bold",
                      }}
                    >
                      Atualizar Foto
                    </label>
                    <input
                      type="file"
                      id={`upload-${pet.id}`}
                      accept="image/*"
                      style={{ display: "none" }} // Esconde o input nativo
                      // Ao selecionar o arquivo, chama a função de atualização
                      onChange={(e) => handleUpdatePetImage(pet.id, e)}
                    />
                  </div>
                  <PetInfo>
                    <strong>
                      {pet.name} ({pet.breed})
                    </strong>
                    <span>
                      Pacote:{" "}
                      {pet.packageFrequency === "weekly"
                        ? "Semanal"
                        : pet.packageFrequency === "bi-weekly"
                        ? "Quinzenal"
                        : pet.packageFrequency === "monthly"
                        ? "Mensal"
                        : "Nenhum"}
                    </span>
                    {pet.lastBathDate && (
                      <small>
                        Último Banho:{" "}
                        {new Date(
                          pet.lastBathDate + "T00:00:00"
                        ).toLocaleDateString()}
                      </small>
                    )}
                    {nextBathDate && (
                      <small>
                        Próximo Sugerido:{" "}
                        <strong>
                          {new Date(
                            nextBathDate + "T00:00:00"
                          ).toLocaleDateString()}
                        </strong>
                      </small>
                    )}
                    {pet.renewalDate && (
                      <small>
                        Renovação:{" "}
                        {/* Nota: A data de Renovação já usava `new Date(pet.renewalDate).toLocaleDateString()`, mas precisa ser corrigida também */}
                        {new Date(
                          pet.renewalDate + "T00:00:00"
                        ).toLocaleDateString()}
                      </small>
                    )}

                    {/* ALERTA DE RENOVAÇÃO */}
                    {isRenewalDue && (
                      <RenewalAlert>🚨 Pacote Vencido! Renovar.</RenewalAlert>
                    )}
                  </PetInfo>
                </PetContainer>

                <ActionButtons>
                  <ActionButton
                    color="#3b82f6"
                    onClick={() => handleChangePackage(pet)}
                  >
                    Alterar Pacote
                  </ActionButton>

                  {/* Botão de Marcar Banho OK */}
                  <ActionButton
                    color="#4CAF50"
                    onClick={() => handleMarkBath(pet)}
                    disabled={Boolean(isRenewalDue)} // Não pode marcar se estiver vencido
                  >
                    Marcar Banho OK
                  </ActionButton>

                  {/* Botão de Renovar Pacote (aparece se vencido ou perto) */}
                  {isRenewalDue && (
                    <ActionButton
                      color="#FFC107"
                      onClick={() => handleRenewPackage(pet)}
                    >
                      Renovar Pacote
                    </ActionButton>
                  )}

                  <RemoveButton onClick={() => handleRemovePet(pet.id)}>
                    Remover Pet
                  </RemoveButton>
                </ActionButtons>
              </PetItem>
            );
          })}
        </PetList>
      )}
    </MainLayout>
  );
}
