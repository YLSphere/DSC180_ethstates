import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Container } from '@chakra-ui/react'
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ListProperty from "./pages/ListProperty";
import PropertyItem from "./pages/PropertyItem";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import { getAuth, onAuthStateChanged,User } from 'firebase/auth';
import ScrollToTop from "./components/ScrollToTop";



function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
      <div>
        <BrowserRouter>
          <ScrollToTop />
          <Container maxW="unset" style={{ margin: 0, padding: 0 }}>
            <NavBar />
            <Routes>
                  {/* User is signed in, show these routes */}
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/listProperty" element={<ListProperty />} />
                  <Route path="/property" element={<PropertyItem />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* User is not signed in, show the signup and login routes */}
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
              {/* Always show the Home route */}
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </div>
    );
  
}

export default App;
