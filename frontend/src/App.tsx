import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
// import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListProperty from "./pages/ListProperty";
import PropertyItem from "./pages/PropertyItem";
// import PropertyBid from "./pages/PropertyBid";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import { Loan } from "./pages/Loan";

function App() {
  return (
    <>
      <ScrollToTop />
      <Container maxW="unset" style={{ margin: 0, padding: 0 }}>
        <NavBar />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Marketplace />} />
          <Route path="/listProperty" element={<ListProperty />} />
          <Route path="/property" element={<PropertyItem />} />
          {/* <Route path="/property/bids" element={<PropertyBid />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path='/loans/:propertyId' element={<Loan />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
