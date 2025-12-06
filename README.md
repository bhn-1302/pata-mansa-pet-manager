# 🐾 Pata Mansa Pet Manager: Sistema de Gestão de Clientes e Pacotes

## ✨ Visão Geral do Projeto

O **Pata Mansa Pet Manager** é uma aplicação web desenvolvida para resolver desafios de gestão de agenda, controle de pacotes de serviços (banho e tosa) e comunicação com o cliente em Pet Shops de pequeno e médio porte.

Este projeto foca em funcionalidades **Full-Stack Fake** (Front-end robusto com persistência local) para demonstrar proficiência em gerenciamento de estado complexo, lógica de negócios baseada em datas e modularização.

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia | Objetivo |
| :--- | :--- | :--- |
| **Framework/Linguagem** | React (Vite) | Construção da interface de usuário. |
| **Estilização** | Styled-Components | Estilos componentizados e dinâmicos (por exemplo, alertas visuais por estado do pet). |
| **Roteamento** | React Router DOM | Gerenciamento de navegação entre páginas (Dashboard, Clientes, Detalhes, Agenda). |
| **Persistência de Dados** | LocalStorage | Simulação de persistência em banco de dados (`localDB.ts`). |
| **Módulos/Utilidades** | TypeScript, UUID | Tipagem forte e geração de IDs universais únicos. |

## 🛠️ Funcionalidades Principais (MVPs)

Este sistema é construído em torno de três pilares de gestão, sendo a lógica de agendamento a funcionalidade central.

### 1. 📂 Módulo de Clientes e Pets (CRUD)

* **Cadastro Completo:** Permite cadastrar clientes com nome, telefone, endereço e múltiplos pets associados.
* **Gestão de Pets:** Cada pet possui nome, raça e um pacote de frequência definido.

### 2. 📅 Gerenciamento de Pacotes e Agendamento Inteligente

Esta é a lógica de negócio mais complexa e o coração do sistema:

* **Pacotes Recorrentes:** Suporte a pacotes **Semanal (7 dias)**, **Quinzenal (15 dias)** e **Mensal (30 dias)**.
* **Próxima Data Sugerida:** A função `getNextBathDate()` calcula a data ideal do próximo banho.
    * **Lógica de Avanço:** Se a data sugerida já estiver no passado, o sistema a avança automaticamente para a próxima data válida no futuro, garantindo que o agendamento esteja sempre à frente.
* **Alertas de Renovação:** Pets com pacote ativo exibem um alerta visual se a data de renovação (`renewalDate`) estiver vencida.
* **Renovação Simples:** Funcionalidade de clique único para renovar o pacote por mais 30 dias a partir de hoje.

### 3. ✅ Registro Flexível e Histórico (Tratamento de Exceções)

* **Registro Retroativo:** A função `handleMarkBath` permite que o usuário digite **manualmente** a data exata em que o banho foi realizado (ex: dois dias atrás), garantindo que os cálculos futuros (`getNextBathDate`) sejam feitos a partir dessa data correta.
    * **Tratamento de Erros:** Implementação de `isValidDate` para validar o formato `YYYY-MM-DD` da data inserida, evitando erros no cálculo.
* **Histórico de Banhos:** Cada pet possui um array **`bathHistory`** que registra a data de todos os banhos marcados, permitindo auditoria e consulta da frequência ao longo do tempo.

### 4. 📞 Painel de Agendamento (AgendaPage) e Comunicação Automatizada

* **Página de Agenda:** Visualização consolidada de **todos** os pets com pacotes ativos, ordenados pela `nextBathDate`.
    * **Sistema de Prioridade:** Os agendamentos com data sugerida no passado são destacados como **ATRASADOS (vermelho)**, atuando como um painel de prioridades para a equipe.
* **Integração com WhatsApp:** Após marcar o banho, o sistema gera uma URL de WhatsApp pré-preenchida com os detalhes do serviço (próxima data sugerida, renovação, endereço do cliente) para envio imediato.

## ⚙️ Como Rodar o Projeto Localmente

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/bhn-1302/pata-mansa-pet-manager.git
    cd pata-mansa-pet-manager
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install 
    # ou
    yarn install
    ```

3.  **Execute o Projeto:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    O aplicativo estará acessível em `http://localhost:5173` (ou porta similar).

---
---

## Autor 
Brenno Henrique do Nascimento

LinkedIn: https://www.linkedin.com/in/brenno-henrique-nascimento
