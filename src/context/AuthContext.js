"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doSignOut } from "@/firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verify if token exists and is valid
          const response = await fetch("/api/auth/verify-token");
          const data = await response.json();
          if (data.success) {
            setCurrentUser(user);
            // Set user data
            setUserData(data.data);
            setUserLoggedIn(true);
          } else {
            // If token is invalid, attempt to refresh it
            const tokenResponse = await fetch("/api/auth/set-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user.uid,
                email: user.email,
              }),
            });
            if (tokenResponse.ok) {
              const data = await tokenResponse.json();
              if (data && data.data) {
                setCurrentUser(user);
                setUserData(data.data);
                setUserLoggedIn(true);
              } else {
                console.error("Invalid data structure received");
                setCurrentUser(null);
                setUserLoggedIn(false);
              }
            }
          }
        } catch (error) {
          console.error("Auth state error:", error);
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      // Sign out from Firebase
      await doSignOut();

      // Remove token from cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      window.location.href = "/sign-in";

      setCurrentUser(null);
      setUserData(null);
      setUserLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    userData,
    setUserData,
    setCurrentUser,
    logout, // Add logout to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
