import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { Clients } from "../pages/Clients";
import EditClientPage from "../pages/Clients/EditClientPage";
import ClientDetailsPage from "../pages/Clients/ClientDetailsPage";
import AgendaPage from "../pages/Agenda/AgendaPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/clientes/:id/edit" element={<EditClientPage />} />
        <Route path="/clientes/:id" element={<ClientDetailsPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
      </Routes>
    </BrowserRouter>
  );
};
