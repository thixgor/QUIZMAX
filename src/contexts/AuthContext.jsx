import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const storedUser = localStorage.getItem('quizmax_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Buscar usuários do localStorage
    const users = JSON.parse(localStorage.getItem('quizmax_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userWithoutPassword);
      localStorage.setItem('quizmax_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Email ou senha incorretos' };
  };

  const register = (name, email, password) => {
    // Verificar se o email já está cadastrado
    const users = JSON.parse(localStorage.getItem('quizmax_users') || '[]');
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return { success: false, error: 'Email já cadastrado' };
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('quizmax_users', JSON.stringify(users));

    // Fazer login automaticamente
    const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userWithoutPassword);
    localStorage.setItem('quizmax_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizmax_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
