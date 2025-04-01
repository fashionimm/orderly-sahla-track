import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
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
      // For demo purposes, show a success message for demo@example.com
      if (email === 'demo@example.com' && password === 'demo123') {
        toast.success(language === 'en' ? 'Demo login successful!' : 'Connexion démo réussie!');
        const result = await signIn(email, password);
        if (!result.success) {
          setError(result.error || (language === 'en' ? 'Login failed' : 'Échec de la connexion'));
        }
        return;
      }
      
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.error || (language === 'en' ? 'Login failed' : 'Échec de la connexion'));
        toast.error(language === 'en' ? 'Failed to sign in' : 'Échec de la connexion');
      } else {
        if (rememberMe) {
          localStorage.setItem('sahla-email', email);
          localStorage.setItem('sahla-password', password);
        } else {
          localStorage.removeItem('sahla-email');
          localStorage.removeItem('sahla-password');
        }
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

  const demoHint = 
    <div className="text-xs text-muted-foreground mt-2 text-center">
      {language === 'en' 
        ? 'For demo, try: demo@example.com / demo123' 
        : 'Pour démo, essayez: demo@example.com / demo123'}
    </div>;

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
          {demoHint}
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
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg viewBox="0 0 48 48" className="h-5 w-5">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
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
