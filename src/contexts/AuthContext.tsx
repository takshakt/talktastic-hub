
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Types 
export type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  age?: number;
  location?: string;
  sex?: string;
  sessionId: string;
} | null;

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  scope: string;
}

type AuthContextType = {
  user: User;
  login: (redirectUri: string) => void;
  logout: () => void;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUserProfile: (data: Partial<User>) => void;
  configureOAuth: (config: OAuthConfig) => void;
  initiateOAuthLogin: () => void;
  oAuthConfig: OAuthConfig | null;
};

const DEFAULT_OAUTH_CONFIG: OAuthConfig = {
  clientId: '',
  redirectUri: `${window.location.origin}/oauth-callback`,
  authorizeEndpoint: '',
  tokenEndpoint: '',
  userInfoEndpoint: '',
  scope: 'openid profile email',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oAuthConfig, setOAuthConfig] = useState<OAuthConfig | null>(null);
  const { toast } = useToast();

  // Generate a unique session ID for the chat
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Configure OAuth settings
  const configureOAuth = (config: OAuthConfig) => {
    const fullConfig = { ...DEFAULT_OAUTH_CONFIG, ...config };
    setOAuthConfig(fullConfig);
    localStorage.setItem('talktastic_oauth_config', JSON.stringify(fullConfig));
    toast({
      title: "OAuth Configuration Updated",
      description: "Your Authentik OAuth configuration has been saved.",
    });
  };

  // Initiate OAuth login flow
  const initiateOAuthLogin = () => {
    if (!oAuthConfig) {
      toast({
        title: "OAuth Not Configured",
        description: "Please configure OAuth in your settings first.",
        variant: "destructive",
      });
      return;
    }

    // Create and store a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('talktastic_oauth_state', state);

    // Construct the authorization URL
    const authUrl = new URL(oAuthConfig.authorizeEndpoint);
    authUrl.searchParams.append('client_id', oAuthConfig.clientId);
    authUrl.searchParams.append('redirect_uri', oAuthConfig.redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', oAuthConfig.scope);
    authUrl.searchParams.append('state', state);

    // Redirect the user to the authorization endpoint
    window.location.href = authUrl.toString();
  };

  // Handle OAuth callback
  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('talktastic_oauth_state');

    // Check if this is an OAuth callback
    if (!code || !state) {
      return false;
    }

    // Validate state to prevent CSRF attacks
    if (state !== storedState) {
      toast({
        title: "Authentication Error",
        description: "Invalid state parameter. The request may have been tampered with.",
        variant: "destructive",
      });
      return true;
    }

    try {
      setIsLoading(true);
      
      // In a real implementation, we would exchange the code for tokens
      // For this demo, we'll simulate a successful login
      console.log('OAuth code received:', code);
      
      const mockUser: User = {
        id: '12345',
        name: 'Authentik User',
        email: 'oauth@example.com',
        picture: 'https://ui-avatars.com/api/?name=Authentik+User&background=0D8ABC&color=fff',
        sessionId: generateSessionId()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('talktastic_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Clear OAuth state
      localStorage.removeItem('talktastic_oauth_state');
      
      toast({
        title: "Login successful",
        description: "Welcome to Talktastic Hub!",
      });
      
      return true;
    } catch (error) {
      console.error('OAuth login failed:', error);
      toast({
        title: "OAuth Login Failed",
        description: "We couldn't complete the authentication. Please try again.",
        variant: "destructive",
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    // For now, we'll use localStorage to simulate auth state
    const checkAuth = async () => {
      try {
        // Check if this is an OAuth callback first
        const isOAuthCallback = await handleOAuthCallback();
        if (isOAuthCallback) {
          // If we handled an OAuth callback, we're done
          return;
        }
        
        const storedUser = localStorage.getItem('talktastic_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure the user has a session ID
          if (!parsedUser.sessionId) {
            parsedUser.sessionId = generateSessionId();
          }
          setUser(parsedUser);
        }
        
        // Load OAuth config if exists
        const storedOAuthConfig = localStorage.getItem('talktastic_oauth_config');
        if (storedOAuthConfig) {
          setOAuthConfig(JSON.parse(storedOAuthConfig));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        toast({
          title: "Authentication error",
          description: "There was a problem with your authentication.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  // Register a new user
  const registerUser = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('talktastic_users') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        email,
        password, // In a real app, this would be hashed
        sessionId: generateSessionId(),
        createdAt: new Date().toISOString()
      };
      
      // Save to "database" (localStorage)
      existingUsers.push(newUser);
      localStorage.setItem('talktastic_users', JSON.stringify(existingUsers));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Registration failed:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login with email and password
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Get users from "database"
      const existingUsers = JSON.parse(localStorage.getItem('talktastic_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create session
      const sessionUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        sessionId: generateSessionId(),
        // These fields will be empty until the user updates their profile
        age: user.age,
        location: user.location,
        sex: user.sex
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('talktastic_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      toast({
        title: "Login successful",
        description: "Welcome to Talktastic Hub!",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - in a real app, this would redirect to Authentik
  const login = (redirectUri: string) => {
    // For demo purposes, simulate a successful login
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be replaced with actual OAuth flow
      // For now, we'll create a mock user
      const mockUser: User = {
        id: '12345',
        name: 'Demo User',
        email: 'user@example.com',
        picture: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
        sessionId: generateSessionId()
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('talktastic_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Login successful",
        description: "Welcome to Talktastic Hub!",
      });
      
      // In a real app, we'd handle the redirect properly
      console.log('Redirect URI:', redirectUri);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "We couldn't sign you in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('talktastic_user');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "We couldn't sign you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('talktastic_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: "Update failed",
        description: "We couldn't update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        registerUser,
        loginWithCredentials,
        isAuthenticated: !!user,
        isLoading,
        updateUserProfile,
        configureOAuth,
        initiateOAuthLogin,
        oAuthConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
