import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const item = localStorage.getItem("username");
    if (item) {
      try {
        const parsed = JSON.parse(item);
        if (parsed.expiry > Date.now()) {
          setUsername(parsed.value);
        }
      } catch {
        setUsername("");
      }
    }
  }, []);

  useEffect(() => {
    if (username) {
      const now = new Date();
      const item = {
        value: username,
        expiry: now.getTime() + 86400000,
      };
      localStorage.setItem("username", JSON.stringify(item));
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}