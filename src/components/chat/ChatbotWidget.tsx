
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Send, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotWidgetProps {
  onClose: () => void;
}

const ChatbotWidget = ({ onClose }: ChatbotWidgetProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user?.name}! I'm your Sahla-Track assistant. How can I help you today?`,
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      handleBotResponse(input);
      setIsLoading(false);
    }, 800);
  };

  const handleBotResponse = (userInput: string) => {
    let botResponse = '';
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('order') && lowerInput.includes('status')) {
      botResponse = "You can check your order status in the Orders section. Would you like me to guide you there?";
    } else if (lowerInput.includes('payment') || lowerInput.includes('binance')) {
      botResponse = "Sahla-Track uses Binance Pay for all subscription payments. Your payment information is securely processed and never stored on our servers.";
    } else if (lowerInput.includes('plan') || lowerInput.includes('upgrade')) {
      botResponse = "We offer three plans: Free ($0/month), Premium ($4.99/month), and Unlimited ($9.99/month). You can upgrade your plan in the Subscription section.";
    } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
      botResponse = "I'm here to help! You can ask me questions about orders, payments, or your account. For complex issues, please contact our support team.";
    } else {
      botResponse = "I'm still learning to respond to different questions. Can you ask something about orders, payments, or your account?";
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      text: botResponse,
      sender: 'bot'
    };

    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <Card className="fixed bottom-6 right-6 w-[350px] shadow-lg border-sahla-200 z-50">
      <CardHeader className="bg-sahla-500 text-white p-3 rounded-t-lg flex flex-row justify-between items-center">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Sahla Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-white hover:bg-sahla-600">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 max-h-[350px] overflow-y-auto bg-slate-50">
        <div className="space-y-3">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-2 ${
                  message.sender === 'user' 
                    ? 'bg-sahla-500 text-white' 
                    : 'bg-white border border-slate-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-2 bg-white border border-slate-200">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="bg-sahla-500 hover:bg-sahla-600"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatbotWidget;
