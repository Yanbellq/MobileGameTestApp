import React, { createContext, useContext, useState, useEffect } from 'react';
import { Href, usePathname } from 'expo-router';

const HistoryContext = createContext({ history: [] as Href[] });

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<Href[]>(['/']);
  const pathname = usePathname();

  useEffect(() => {
    setHistory(prevHistory => [...prevHistory, pathname as Href]);
  }, [pathname]);

  return (
    <HistoryContext.Provider value={{ history }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
