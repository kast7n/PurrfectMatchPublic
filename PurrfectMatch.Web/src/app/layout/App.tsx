import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";
import Footer from "./Footer";
import { purrfectTheme } from "../../theme/purrfectTheme";
import FloatingActionButtons from '../shared/components/FloatingActionButtons';

function App() {
  const { darkMode } = useAppSelector(state => state.ui);
  const mode = darkMode ? 'dark' : 'light';
  
  // Use the purrfectTheme from the theme file
  const theme = purrfectTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Box sx={{
        minHeight: '100vh',
        background: darkMode ? 
          'radial-gradient(circle, rgba(27, 38, 54, 0.95), #111827)' :
          'radial-gradient(circle, rgba(249, 250, 251, 0.95), #F5F7FA)',
        py: 6
      }}>
        <Container maxWidth="xl" sx={{mt: 8}}>
          <Outlet/>
        </Container>
      </Box>
      <Footer/>
      <FloatingActionButtons />
    </ThemeProvider>
  );
}

export default App;
