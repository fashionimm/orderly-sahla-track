
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, User, Mail, Google } from 'lucide-react';
import { toast } from 'sonner';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError(language === 'en' ? "Passwords don't match" : "Les mots de passe ne correspondent pas");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error('Signup error:', error);
      setError(language === 'en' ? 'Failed to create account' : 'Échec de la création du compte');
      toast.error(language === 'en' ? 'Failed to create account' : 'Échec de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error(language === 'en' ? 'Failed to sign up with Google' : 'Échec de l\'inscription avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-sahla-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {language === 'en' ? 'Create an account' : 'Créer un compte'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Sign up for Sahla-Track to start managing your orders'
            : 'Inscrivez-vous à Sahla-Track pour commencer à gérer vos commandes'}
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
            <Label htmlFor="name">
              {language === 'en' ? 'Full Name' : 'Nom complet'}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="name"
                type="text"
                placeholder={language === 'en' ? 'Your name' : 'Votre nom'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'en' ? 'Email' : 'E-mail'}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {language === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-sahla-500 hover:bg-sahla-600" 
            disabled={isLoading}
          >
            {isLoading ? (
              language === 'en' ? 'Creating account...' : 'Création du compte...'
            ) : (
              language === 'en' ? 'Sign Up' : 'S\'inscrire'
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
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <Google className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Sign up with Google' : 'S\'inscrire avec Google'}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {language === 'en' ? 'Already have an account?' : 'Vous avez déjà un compte ?'}{' '}
          <button
            type="button"
            className="text-sahla-500 hover:underline font-medium"
            onClick={onSwitchToLogin}
          >
            {language === 'en' ? 'Sign in' : 'Se connecter'}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
