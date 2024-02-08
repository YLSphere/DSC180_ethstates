// server/server.js
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
import serviceAccount from './firebase-admin.json' assert {type: 'json'}; 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint for creating a custom token
app.post('/api/createCustomToken', async (req, res) => {
  console.log(req);
  const { address, signature, name, email } = req.body;
  console.log(address,signature);
  try {
    const customToken = await admin.auth().createCustomToken(address, {signature, name, email});
    res.json({ customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
