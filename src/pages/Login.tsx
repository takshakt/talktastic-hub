
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';

// Schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login, loginWithCredentials, isLoading, initiateOAuthLogin, oAuthConfig } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('local');
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const handleOAuth = () => {
    if (oAuthConfig && oAuthConfig.clientId) {
      initiateOAuthLogin();
    } else {
      toast({
        title: "OAuth Not Configured",
        description: "Please configure your Authentik OAuth settings in your profile first.",
        variant: "destructive",
      });
    }
  };
  
  const handleDemoAuth = () => {
    login('/chat');
    navigate('/chat');
  };
  
  const onSubmit = async (data: LoginFormValues) => {
    setAuthLoading(true);
    
    try {
      await loginWithCredentials(data.email, data.password);
      navigate('/chat');
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center">Talktastic Hub</CardTitle>
          <CardDescription className="text-center">
            Log in to start chatting with our AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="local">Email</TabsTrigger>
              <TabsTrigger value="authentik">Authentik</TabsTrigger>
              <TabsTrigger value="demo">Demo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="local" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Your password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
              
              <div className="text-center mt-2">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="authentik" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center">
                  {oAuthConfig && oAuthConfig.clientId 
                    ? "Login with your Authentik credentials"
                    : "You need to configure your Authentik OAuth settings first"}
                </p>
                
                <Button 
                  className="w-full"
                  onClick={handleOAuth}
                  disabled={isLoading || !oAuthConfig || !oAuthConfig.clientId}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? 'Logging in...' : 'Log in with Authentik'}
                </Button>
                
                {(!oAuthConfig || !oAuthConfig.clientId) && (
                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-500">
                      <Link to="/profile" className="text-primary font-medium hover:underline">
                        Configure Authentik OAuth
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center">
                  For demonstration purposes only. This will create a demo user.
                </p>
                
                <Button 
                  className="w-full" 
                  onClick={handleDemoAuth}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Demo Login'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
