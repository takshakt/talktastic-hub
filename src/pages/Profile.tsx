
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileForm from '@/components/user/UserProfileForm';
import WebhookSettings from '@/components/settings/WebhookSettings';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login" className="text-primary underline">
              Go to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-6">
          <Link to="/chat" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">User Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information. This data will be sent to the AI agent on first message.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="webhook">
            <Card>
              <CardHeader>
                <CardTitle>n8n Webhook Settings</CardTitle>
                <CardDescription>
                  Configure the webhook URL for your n8n workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebhookSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
