import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: 28px;
  margin: 0;
`;

export const EditLink = styled.button`
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  font-weight: bold;
  &:hover {
    opacity: 0.9;
  }
`;

export const ClientInfo = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #ccc;
  margin: 24px 0;
`;

export const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  align-items: flex-end;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Input = styled.input`
  flex: 1;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #6c63ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

export const Select = styled.select`
  flex: 1;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #6c63ff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

export const Button = styled.button`
  padding: 12px 18px;
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

export const PetList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PetItem = styled.li`
  background: ${({ theme }) => theme.background};
  padding: 14px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const PetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const ActionButton = styled.button<{ color?: string }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${({ color }) => color || "#6c63ff"};
  color: #fff;
  font-weight: bold;
  transition: 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }
`;

export const RemoveButton = styled(ActionButton)`
  background-color: #ff5e5e;
`;

export const RenewalAlert = styled.span`
  font-weight: bold;
  color: #ff5e5e;
  background: #ffeded;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 8px;
`;