import styled from "styled-components";
import { Sidebar } from "../components/Sidebar";
import type React from "react";

const Container = styled.div`
  display: flex;
  height: auto;
  cursor: default;
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  overflow-y: auto;
`;

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <Sidebar />
      <Content>{children}</Content>
    </Container>
  );
};
