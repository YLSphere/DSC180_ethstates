// SignUp.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { auth,signInWithCustomToken,doc,setDoc } from '../firebase.ts'; // adjust the path as necessary
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { firestore } from '../firebase.ts';
import { Input, Button, VStack, Link, Text } from '@chakra-ui/react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const connectWalletAndSignUp = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Account: ", address);
      

        const signature = await signer.signMessage("Authorize linking of MetaMask wallet");
        console.log("sign:", signature)
        // Call your backend API to create a custom Firebase token
        const response = await fetch('http://localhost:3001/api/createCustomToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address,signature ,name, email }),
        });

        const data = await response.json();
        console.log(data);
        // Use the custom token to sign in with Firebase
        await signInWithCustomToken(auth, data.customToken);
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const userDocRef = doc(firestore,'users',userId);
          await setDoc(userDocRef,{name,email,walletAddress: address,signature: signature});
        }
        else{
          console.error('user is not auth')
        }
        // Redirect to a different page after successful sign up
        navigate('/profile'); // Adjust according to your routing setup
      } catch (error) {
        console.error('Error during MetaMask signup:', error);
      }
    } else {
      console.log('MetaMask is not installed!');
    }
  };

  return (
    <VStack spacing={4}>
      <Input 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <Input 
        placeholder="Email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Button colorScheme="blue" onClick={connectWalletAndSignUp}>Sign Up with MetaMask</Button>
      <Text>
        Already have an account? 
        <Link as={RouterLink} to="/login" color="teal.500" ml={1}>
          Log In
        </Link>
      </Text>
    </VStack>
  );
};

export default SignUp;
