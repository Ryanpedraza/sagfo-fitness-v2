

import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { Profile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: 'customer' | 'admin' | 'transporter', phone: string, address: string, city: string, department: string, country: string) => Promise<void>;
  updateUser: (user: Profile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('sagfo_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify user still exists and get latest data
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', parsedUser.id)
            .single();

          if (data && !error) {
            setUser(data as Profile);
            localStorage.setItem('sagfo_user', JSON.stringify(data));
          } else {
            // User not found or error, clear session
            localStorage.removeItem('sagfo_user');
          }
        }
      } catch (error) {
        console.error("Failed to restore session", error);
        localStorage.removeItem('sagfo_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email) // Case insensitive email match
        .single();

      if (error || !data) {
        throw new Error('Credenciales inválidas. Por favor, revisa tu correo.');
      }

      // Simple password check (In production, use hashing!)
      if (data.password !== password) {
        throw new Error('Contraseña incorrecta.');
      }

      const userProfile = data as Profile;
      setUser(userProfile);
      localStorage.setItem('sagfo_user', JSON.stringify(userProfile));
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.message || 'Error al iniciar sesión');
    }
  };

  const register = async (name: string, email: string, password: string, role: 'customer' | 'admin' | 'transporter', phone: string, address: string, city: string, department: string, country: string) => {
    try {
      // Check if email exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .ilike('email', email)
        .single();

      if (existingUser) {
        throw new Error('Este correo electrónico ya está registrado.');
      }

      const newUser = {
        id: `user-${Date.now()}`, // Keep existing ID generation strategy for consistency
        name,
        email,
        role,
        phone,
        address,
        city,
        department,
        // country, // Removed because it's missing in DB schema (error PGRST204)
        password, // Storing plain text as requested/legacy
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('users')
        .insert(newUser);

      if (error) throw error;

      const userProfile = newUser as unknown as Profile; // Cast to Profile
      setUser(userProfile);
      localStorage.setItem('sagfo_user', JSON.stringify(userProfile));
    } catch (err: any) {
      console.error("Register error:", err);
      throw new Error(err.message || 'Error al registrarse');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('sagfo_user');
  };

  const updateUser = async (updatedProfile: Profile) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updatedProfile)
        .eq('id', updatedProfile.id);

      if (error) throw error;

      setUser(updatedProfile);
      localStorage.setItem('sagfo_user', JSON.stringify(updatedProfile));
    } catch (err: any) {
      console.error("Update user error:", err);
      throw new Error('Error al actualizar perfil');
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};