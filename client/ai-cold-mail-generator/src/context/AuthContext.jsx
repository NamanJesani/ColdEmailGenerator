import React, { useEffect, useContext, createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const parsedUser = userInfo ? JSON.parse(userInfo) : null;
        setUser(parsedUser || { token });
      } catch (error) {
        localStorage.removeItem("userInfo");
      }
    } 
    setLoading(false);  
  }, []);

  const login = (data) => {
    let token = '';
    let userDetails = null;

    if (typeof data === 'string') {
      token = data;
      userDetails = { token };
    } else if (typeof data === 'object' && data !== null) {
      token = data.token || data.user?.token || '';
      userDetails = data.user || data;
    }

    if (token) {
      localStorage.setItem("token", token);
    }
    
    if (userDetails) {
      localStorage.setItem("userInfo", JSON.stringify(userDetails));
      setUser(userDetails);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};