
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const OAuthSettings: React.FC = () => {
  const { oAuthConfig, configureOAuth } = useAuth();
  const { toast } = useToast();
  
  const [clientId, setClientId] = useState(oAuthConfig?.clientId || '');
  const [authorizeEndpoint, setAuthorizeEndpoint] = useState(oAuthConfig?.authorizeEndpoint || '');
  const [tokenEndpoint, setTokenEndpoint] = useState(oAuthConfig?.tokenEndpoint || '');
  const [userInfoEndpoint, setUserInfoEndpoint] = useState(oAuthConfig?.userInfoEndpoint || '');
  const [redirectUri, setRedirectUri] = useState(oAuthConfig?.redirectUri || `${window.location.origin}/oauth-callback`);
  const [scope, setScope] = useState(oAuthConfig?.scope || 'openid profile email');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId || !authorizeEndpoint || !tokenEndpoint || !userInfoEndpoint) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    configureOAuth({
      clientId,
      authorizeEndpoint,
      tokenEndpoint,
      userInfoEndpoint,
      redirectUri,
      scope,
    });
    
    toast({
      title: "Settings Saved",
      description: "Your Authentik OAuth configuration has been updated",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentik OAuth Configuration</CardTitle>
        <CardDescription>
          Configure the connection to your Authentik OIDC/OAuth provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter your Authentik client ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="authorizeEndpoint">Authorization Endpoint</Label>
            <Input
              id="authorizeEndpoint"
              value={authorizeEndpoint}
              onChange={(e) => setAuthorizeEndpoint(e.target.value)}
              placeholder="https://authentik.example.com/application/o/authorize/"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokenEndpoint">Token Endpoint</Label>
            <Input
              id="tokenEndpoint"
              value={tokenEndpoint}
              onChange={(e) => setTokenEndpoint(e.target.value)}
              placeholder="https://authentik.example.com/application/o/token/"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userInfoEndpoint">UserInfo Endpoint</Label>
            <Input
              id="userInfoEndpoint"
              value={userInfoEndpoint}
              onChange={(e) => setUserInfoEndpoint(e.target.value)}
              placeholder="https://authentik.example.com/application/o/userinfo/"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="redirectUri">Redirect URI</Label>
            <Input
              id="redirectUri"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              placeholder={`${window.location.origin}/oauth-callback`}
            />
            <p className="text-xs text-muted-foreground">
              Make sure to add this URL to your Authentik application's redirect URIs
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scope">OAuth Scope</Label>
            <Input
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="openid profile email"
            />
          </div>
          
          <Button type="submit" className="w-full">Save OAuth Configuration</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <p>After configuration, you can use the OAuth login on the login page.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OAuthSettings;
