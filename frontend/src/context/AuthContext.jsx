import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const resp = await fetch("http://localhost:8000/api/check", {
        credentials: "include",
      });
      if (resp.ok) {
        setIsAuth(true);
      }
    } catch (error) {
      console.error(`auth  failed ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
