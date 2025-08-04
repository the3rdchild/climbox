// src/services/firestore-user.ts
import {
    collection,
    doc,
    setDoc,
    getDocs,
    getDoc,
    query,
    where,
  } from "firebase/firestore";
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    getAuth,
  } from "firebase/auth";
  import { db } from "./firestore";
  
  const auth = getAuth();
  
  export const userService = {
    createUser: async (email: string, password: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    },
  
    signInUser: async (email: string, password: string) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    },
  
    signOutUser: async () => {
      await signOut(auth);
    },
  
    resetPassword: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    },
  
    storeUser: async (
      fullName: string,
      email: string,
      organization: string,
      token?: string
    ) => {
      const docRef = doc(db, `users/${email}`);
      await setDoc(docRef, {
        fullName,
        email,
        organization,
      });
      return { data: { id: email, fullName, organization } };
    },
  
    getSelf: async (token?: string) => {
      // Simulasi, karena token tidak digunakan dalam Firestore langsung
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map((doc) => doc.data());
      return { data: users[0] }; // sementara ambil pengguna pertama
    },
  
    getAdministeredSites: async (token?: string) => {
      const snapshot = await getDocs(collection(db, "sites"));
      const sites = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: sites }; // filter by user.email/token kalau tersedia
    },
  };
  