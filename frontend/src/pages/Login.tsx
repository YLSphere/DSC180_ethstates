import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { auth, getFirestore,collection,query,where,getDocs } from '../firebase'; // Import your Firebase configuration
import { Button, Text, VStack, useToast } from '@chakra-ui/react';

const Login = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request access to the user's MetaMask wallet
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create an Ethereum provider and get the signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Get the user's wallet address
        const address = await signer.getAddress();
        
        // Set the wallet address in state
        setWalletAddress(address);
        
        // You can proceed with your login logic here
        // For example, you can check if this address exists in your Firestore database and log the user in.
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.log('MetaMask is not installed!');
    }}
  const handleLogin = async () => {
    try {
      // Query Firestore to check if the wallet address exists
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('walletAddress', '==', walletAddress));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Wallet address exists, log the user in
        alert('Successfully logged in!');
        console.log(snapshot);
        // You can add the logic to set the user's login state here
      } else {
        // Wallet address doesn't exist, prompt user to sign up
        alert("Wallet address not found. Please sign up to continue.");
        navigate('/signup'); // Redirect to the sign-up page
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error if necessary
    }
  };

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={connectWallet}>Connect MetaMask Wallet</Button>
      {walletAddress && <Text>Wallet Address: {walletAddress}</Text>}
      <Button colorScheme="teal" onClick={handleLogin}>Login</Button>
    </VStack>
  );
}
export default Login;