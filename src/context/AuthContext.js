import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
        signup,
        logout,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};