import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user, accounts, logout } = useAuth();
  const { t } = useLanguage();
  const [showAccounts, setShowAccounts] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="fixed right-0 top-0 z-30 ml-16 flex h-16 w-[calc(100%-4rem)] items-center justify-end gap-4 border-b border-border bg-card px-6 shadow-sm">
        <LanguageSelector />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium">{user?.name || 'Пользователь'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-3 py-2">
              <p className="text-sm text-muted-foreground">{t('accountNumber')}</p>
              <p className="font-medium">{accounts[0]?.number || 'N/A'}</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-sm text-muted-foreground">{t('balance')}</p>
              <p className="text-lg font-bold text-primary">
                {totalBalance.toLocaleString()} ₸
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowAccounts(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              {t('manageAccounts')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Dialog open={showAccounts} onOpenChange={setShowAccounts}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('manageAccounts')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{t('productGroup')}</p>
                  <p className="font-medium">{account.productGroup}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t('accountNumber')}</p>
                  <p className="font-medium">{account.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('balance')}</p>
                  <p className="text-lg font-bold text-primary">
                    {account.balance.toLocaleString()} ₸
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
