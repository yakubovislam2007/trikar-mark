import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const DocumentsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('documents')}</h1>

      <Card className="max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {t('documentsInIsmet')}
          </h2>
          <p className="mb-6 text-muted-foreground">
            Для просмотра и управления документами перейдите в систему ISMET
          </p>
          <Button>
            Открыть ISMET
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;
