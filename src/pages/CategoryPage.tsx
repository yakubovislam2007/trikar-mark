import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Beer, Droplets, Shirt, Footprints, Cigarette, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

const categories = [
  { id: 'beer', icon: Beer, labelKey: 'beer', color: 'bg-amber-500' },
  { id: 'motor-oils', icon: Droplets, labelKey: 'motorOils', color: 'bg-slate-600' },
  { id: 'light-industry', icon: Shirt, labelKey: 'lightIndustry', color: 'bg-pink-500' },
  { id: 'footwear', icon: Footprints, labelKey: 'footwear', color: 'bg-orange-500' },
  { id: 'tobacco', icon: Cigarette, labelKey: 'tobacco', color: 'bg-emerald-600' },
  { id: 'medicines', icon: Pill, labelKey: 'medicines', color: 'bg-blue-500' },
];

const CategoryPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setSelectedCategory } = useAuth();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-primary">TRIKAR</h1>
        <LanguageSelector />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-semibold text-foreground">
          {t('selectCategory')}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="flex flex-col items-center p-8">
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${category.color}`}
                >
                  <category.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-center text-lg font-medium text-foreground">
                  {t(category.labelKey)}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
