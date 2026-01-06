import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setUser({
      id: '1',
      email: email,
      name: email.split('@')[0],
    });
    navigate('/category');
  };

  return (
    <div className="min-h-screen auth-gradient flex flex-col">
      {/* Language selector in top right */}
      <div className="absolute right-6 top-6">
        <LanguageSelector variant="auth" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {/* Logo */}
        <h1 className="mb-8 text-5xl font-bold tracking-tight text-primary-foreground">
          TRIKAR
        </h1>

        {/* Auth card */}
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <h2 className="text-center text-2xl font-semibold text-foreground">
              {isLogin ? t('login') : t('register')}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              {isLogin && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              )}
              <Button type="submit" className="w-full" size="lg">
                {isLogin ? t('login') : t('register')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? t('noAccount') : t('hasAccount')}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary hover:underline"
              >
                {isLogin ? t('register') : t('login')}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
