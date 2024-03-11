import React, { useState } from 'react';
import { firestore } from '../firebase.ts';
import { collection, addDoc } from 'firebase/firestore';
import { Box, VStack, FormControl, FormLabel, Input, Button,useToast } from '@chakra-ui/react';

const InvestorSignup = () => {
  const [companyName, setCompanyName] = useState('');
  const [maxFinance, setMaxFinance] = useState('');
  const [aprRange, setAprRange] = useState('');
  const [tenureRange, setTenureRange] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const toast = useToast();
  const investorsCollectionRef = collection(firestore, "Investor_data");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const docRef = await addDoc(investorsCollectionRef, {
      companyName,
      maxFinance,
      aprRange,
      tenureRange,
      companyWebsite
    });
    
    toast({
        title: 'Submission successful',
        description: "We've received your information.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setCompanyName('');
    setMaxFinance('');
    setAprRange('');
    setTenureRange('');
    setCompanyWebsite('');
  } catch (error) {
    console.error("Error adding document: ", error);
  }
  
};

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Company Name</FormLabel>
            <Input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Max Finance Value</FormLabel>
            <Input type="number" value={maxFinance} onChange={(e) => setMaxFinance(e.target.value)} placeholder="Max Finance Value" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>APR Range</FormLabel>
            <Input type="text" value={aprRange} onChange={(e) => setAprRange(e.target.value)} placeholder="APR Range" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Tenure Range</FormLabel>
            <Input type="text" value={tenureRange} onChange={(e) => setTenureRange(e.target.value)} placeholder="Tenure Range" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Company Website</FormLabel>
            <Input type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="Link to Company Website" />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg" mt={4}>Submit</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default InvestorSignup;
