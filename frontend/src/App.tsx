import { Routes, Route } from "react-router-dom";
import { Container} from "@chakra-ui/react";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListProperty from "./pages/ListProperty";
import PropertyItem from "./pages/PropertyItem";
import Loaners from "./pages/Loaners";
import ListLoaner from "./pages/ListLoaner";
// import PropertyBid from "./pages/PropertyBid";
import Profile from "./pages/Profile";
// import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import {useEffect, useState} from "react";

function App() {
  
  const [containerHeight, setContainerHeight] = useState('100vh');
  useEffect(() => {
    function handleResize() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const newHeight = documentHeight > windowHeight ? '100%' : '100vh';
      setContainerHeight(newHeight);
    }

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize();

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div style = {{height: containerHeight}}>
      <ScrollToTop />
      <Container maxW="unset" style={{ margin: 0, padding: 0 }} bgImage = "background.jpg" objectFit="cover" backgroundRepeat="repeat-y" 
      bgPosition={"calc(50% - 50px) 45%"} h="100%">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/listProperty" element={<ListProperty />} />
          <Route path="/property" element={<PropertyItem />} />
          {/* <Route path="/property/bids" element={<PropertyBid />} /> */}
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/loaners" element={<Loaners />} /> */}
          <Route path="/forInvestors" element={<ListLoaner />} />
          {/* <Route path="*" element={<NotFound />}/> */}
        </Routes>
      </Container>
    </div>
  );
}

export default App;
