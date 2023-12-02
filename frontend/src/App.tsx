import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from '@chakra-ui/react'
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListProperty from "./pages/ListProperty";
import PropertyItem from "./pages/PropertyItem";
import Profile from "./pages/Profile";
import NavBarV2 from "./components/NavBarV2";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Container maxW="unset" style={{ margin: 0, padding: 0 }}>
        <NavBarV2 />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/listProperty" element={<ListProperty />} />
          <Route path="/marketplace/:id" element={<PropertyItem />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
