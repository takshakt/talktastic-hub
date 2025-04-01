
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatContainer from '@/components/chat/ChatContainer';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return null; // Will redirect via the useEffect
  }
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-chat-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-bold">Talktastic Hub</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Chat content */}
      <div className="flex-1 overflow-hidden container mx-auto max-w-4xl my-6 rounded-lg shadow-lg bg-white border border-gray-100">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Chat;
