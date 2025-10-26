import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'contractor' | 'engineer' | 'supplier' | 'project_manager' | 'admin';
  companyName?: string;
  gstNumber?: string;
  panNumber?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: 'contractor' | 'engineer' | 'supplier' | 'project_manager';
  companyName?: string;
  gstNumber?: string;
  panNumber?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authAPI.getMe();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.user, token },
          });
        } catch (error) {
          localStorage.removeItem('authToken');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
        }
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login({ email, password });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data.user, token: response.data.token },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data.user, token: response.data.token },
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    authAPI.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook to check if user has specific role
export const useRole = (requiredRole: string): boolean => {
  const { user } = useAuth();
  return user?.role === requiredRole;
};

// Hook to check if user has any of the specified roles
export const useRoles = (requiredRoles: string[]): boolean => {
  const { user } = useAuth();
  return user ? requiredRoles.includes(user.role) : false;
};
