import { Header } from "./components/Header";
import { ThemeWrapper } from "./styles/ThemeWrapper";
import { AppRoutes } from "./routes";

function App() {
  return (
    <ThemeWrapper>
      <Header />
      <AppRoutes />
    </ThemeWrapper>
  );
}

export default App;
