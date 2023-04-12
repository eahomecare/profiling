import { Text, Button, Stack } from "@mantine/core";
import { ThemeProvider } from "./ThemeProvider";
import Login from "./pages/Login/Login";


const handleLogin = (username: string, password: string) => {
  console.log(`Logging in with username: ${username} and password: ${password}`);
  // Perform login logic here
};

export default function App() {
  return (
    <ThemeProvider>
      <Login />
    </ThemeProvider>
  );
}


