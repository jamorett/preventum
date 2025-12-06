import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '927922432524-n92mc3ib9jcp1e88ducfr1ggssu6lamh.apps.googleusercontent.com', // From google-services.json oauth_client with client_type: 3
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo.data;
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      // Check if user exists, if not create
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', uid), {
          email: userCredential.user.email,
          role: 'user', // Default role for Google Sign In
          isProfileComplete: false,
          createdAt: new Date(),
          photoURL: userCredential.user.photoURL,
          displayName: userCredential.user.displayName
        });
      }

      await fetchUserData(uid);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  };

  const signup = async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    // Create initial user document
    await setDoc(doc(db, 'users', uid), {
      email,
      role,
      isProfileComplete: false,
      createdAt: new Date(),
    });
    await fetchUserData(uid);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateProfileData = async (data) => {
    if (user) {
      try {
        // Update Auth Profile if name is provided
        if (data.name) {
          await updateProfile(auth.currentUser, {
            displayName: data.name
          });
          // Update local user state to reflect change immediately
          setUser({ ...auth.currentUser, displayName: data.name });
        }
      } catch (error) {
        console.error("Error updating auth profile:", error);
        // Continue to update Firestore even if Auth update fails
      }

      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        isProfileComplete: true
      }, { merge: true });
      await fetchUserData(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoading,
        login,
        googleLogin,
        signup,
        logout,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};