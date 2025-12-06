import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.aside`
  width: 220px;
  height: calc(100vh - 70px);
  background: ${({ theme }) => theme.background};
  border-right: 1px solid #ccc;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
`;

const MenuItem = styled(Link)`
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 1rem;
  padding: 8px 0;

  &:hover {
    opacity: 0.7;
  }
`;

export const Sidebar = () => {
  return (
    <Container>
      <MenuItem to="/">Dashboard</MenuItem>
      <MenuItem to="/clientes">Clientes</MenuItem>
    </Container>
  );
};
