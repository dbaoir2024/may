import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { pool } from "./../../../server/src/lib/db"; // Import your PostgreSQL query function
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verify JWT token
  const verifyToken = async (token: string): Promise<User | null> => {
    try {
      // In production, verify against your secret key
      const decoded = jwt.decode(token) as { userId: string };
      if (!decoded?.userId) return null;

      const result = await query(
        'SELECT id, username, email, name, role, avatar_url FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const verifiedUser = await verifyToken(storedToken);
          if (verifiedUser) {
            setUser(verifiedUser);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Verify credentials against database
      const result = await query(
        'SELECT id, username, email, name, role, password_hash FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.REACT_APP_JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      // Store token and user data
      localStorage.setItem('token', token);
      setToken(token);
      
      // Remove password hash before setting user
      const { password_hash, ...userData } = user;
      setUser(userData);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};