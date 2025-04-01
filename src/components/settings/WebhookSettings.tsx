
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import chatService from '@/services/chatService';

// Schema for form validation
const webhookSchema = z.object({
  webhookUrl: z.string().url({ message: 'Please enter a valid URL' }),
});

type WebhookFormValues = z.infer<typeof webhookSchema>;

const WebhookSettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      webhookUrl: 'https://n8n.example.com/webhook/chat',
    },
  });
  
  const onSubmit = async (data: WebhookFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update webhook URL in chat service
      chatService.setWebhookUrl(data.webhookUrl);
      
      toast({
        title: "Webhook updated",
        description: "Your webhook URL has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update webhook:', error);
      toast({
        title: "Update failed",
        description: "We couldn't update the webhook URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>n8n Webhook URL</FormLabel>
              <FormControl>
                <Input placeholder="https://n8n.example.com/webhook/chat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          variant="outline"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Webhook URL'}
        </Button>
      </form>
    </Form>
  );
};

export default WebhookSettings;
