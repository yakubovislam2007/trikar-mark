import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Account {
  id: string;
  number: string;
  balance: number;
  productGroup: string;
}

interface AuthContextType {
  user: User | null;
  accounts: Account[];
  selectedCategory: string | null;
  setUser: (user: User | null) => void;
  setSelectedCategory: (category: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockAccounts: Account[] = [
  { id: '1', number: 'ACC-001234', balance: 150000, productGroup: 'Обувные товары' },
  { id: '2', number: 'ACC-001235', balance: 85000, productGroup: 'Табачная продукция' },
  { id: '3', number: 'ACC-001236', balance: 230000, productGroup: 'Лекарственные средства' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const logout = () => {
    setUser(null);
    setSelectedCategory(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accounts: mockAccounts, 
      selectedCategory,
      setUser, 
      setSelectedCategory,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
