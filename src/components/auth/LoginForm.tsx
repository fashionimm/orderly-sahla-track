
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, User, Google } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const { t, language } = useLanguage();
  
  // Check for saved credentials on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('sahla-email');
    const savedPassword = localStorage.getItem('sahla-password');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('sahla-email', email);
        localStorage.setItem('sahla-password', password);
      } else {
        localStorage.removeItem('sahla-email');
        localStorage.removeItem('sahla-password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(language === 'en' ? 'Invalid email or password' : 'Email ou mot de passe invalide');
      toast.error(language === 'en' ? 'Failed to sign in' : 'Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(language === 'en' ? 'Failed to sign in with Google' : 'Échec de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-sahla-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {language === 'en' ? 'Login to Sahla-Track' : 'Connectez-vous à Sahla-Track'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Enter your credentials to access your account' 
            : 'Entrez vos identifiants pour accéder à votre compte'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'en' ? 'Email' : 'E-mail'}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder={language === 'en' ? 'your@email.com' : 'votre@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {language === 'en' ? 'Password' : 'Mot de passe'}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {language === 'en' ? 'Remember me' : 'Se souvenir de moi'}
            </label>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-sahla-500 hover:bg-sahla-600" 
            disabled={isLoading}
          >
            {isLoading ? (
              language === 'en' ? 'Signing in...' : 'Connexion en cours...'
            ) : (
              language === 'en' ? 'Sign In' : 'Se connecter'
            )}
          </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">
              {language === 'en' ? 'Or continue with' : 'Ou continuer avec'}
            </span>
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Google className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Sign in with Google' : 'Se connecter avec Google'}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {language === 'en' ? "Don't have an account?" : "Vous n'avez pas de compte ?"}{' '}
          <button
            type="button"
            className="text-sahla-500 hover:underline font-medium"
            onClick={onSwitchToSignup}
          >
            {language === 'en' ? 'Sign up' : 'Inscrivez-vous'}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
