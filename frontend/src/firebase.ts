import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore,collection,setDoc,doc,query,where,getDocs } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyDqv9sWkrgkZ5J8FLYt6sriJvqbWji7BeY",
  authDomain: "dsc180-94189.firebaseapp.com",
  projectId: "dsc180-94189",
  storageBucket: "dsc180-94189.appspot.com",
  messagingSenderId: "580872694681",
  appId: "1:580872694681:web:a220eef19283ea92000108",
  measurementId: "G-G1D18GFKWJ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

const auth = getAuth(app);

export { auth,firestore,app,signInWithCustomToken,setDoc,doc,collection,getFirestore,query,where,getDocs };


