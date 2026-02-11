import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  function login(userData) {
    if (!userData.token) {
      throw new Error('Token missing');
    }
  
    setUser(userData);
    localStorage.setItem('USER', JSON.stringify(userData));
    localStorage.setItem('TOKEN', userData.token);
    localStorage.setItem('ROLE', userData.role);
  }
  

  function logout() {
    setUser(null);
    localStorage.clear();
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
