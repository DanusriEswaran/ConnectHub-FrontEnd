import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  const uploadProfilePic = async (formData) => {
    try {
      const res = await axios.post("http://localhost:8800/api/user", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the user context with the new profile picture information
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profilePic: res.data.profilePic,
      }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, uploadProfilePic }}>
      {children}
    </AuthContext.Provider>
  );
};
