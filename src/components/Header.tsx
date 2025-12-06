import styled from "styled-components";
import { useTheme } from "../context/useTheme";

const Container = styled.header`
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid #ccc;
  cursor: default;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
`;

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container>
      <h2>Pata Mansa</h2>
      <Button onClick={toggleTheme}>
        Tema: {theme === "light" ? "🌞" : "🌙"}
      </Button>
    </Container>
  );
};
