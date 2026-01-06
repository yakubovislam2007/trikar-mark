import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Barcode, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

const menuItems = [
  { icon: Home, path: '/dashboard', labelKey: 'home' },
  { icon: FileText, path: '/documents', labelKey: 'documents' },
  { icon: Barcode, path: '/codes', labelKey: 'codes' },
  { icon: Tags, path: '/marks', labelKey: 'marks' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-primary shadow-lg">
      <div className="flex h-full flex-col items-center py-4">
        {/* Logo */}
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
          <span className="text-lg font-bold text-primary">T</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary-foreground text-primary shadow-md'
                        : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {t(item.labelKey)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
