import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Package, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const mockLastOrder = {
  id: 'ORD-2024-001234',
  date: '2024-01-05',
  status: 'in_process',
  productName: 'Кроссовки Nike Air Max',
  quantity: 500,
  codes: [
    { code: '010460001234567821abcd1234', status: 'applied' },
    { code: '010460001234567821efgh5678', status: 'in_circulation' },
    { code: '010460001234567821ijkl9012', status: 'ordered' },
  ],
};

const statusConfig = {
  ordered: { label: 'Заказан', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  in_process: { label: 'В процессе', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  applied: { label: 'Нанесен', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  in_circulation: { label: 'В обороте', color: 'bg-green-100 text-green-700 border-green-200' },
  withdrawn: { label: 'Выведен', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ordered;
    return (
      <Badge variant="outline" className={config.color}>
        {status === 'in_process' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
        {status === 'in_circulation' && <CheckCircle className="mr-1 h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('home')}</h1>

      {/* Last Order Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t('lastOrder')}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/codes/${mockLastOrder.id}`)}
            >
              {t('viewDetails')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">ID заказа</p>
              <p className="font-semibold">{mockLastOrder.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('date')}</p>
              <p className="font-semibold">{mockLastOrder.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('status')}</p>
              {getStatusBadge(mockLastOrder.status)}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{mockLastOrder.productName}</span>
              <Badge variant="secondary">{mockLastOrder.quantity} шт</Badge>
            </div>

            {/* Sample codes */}
            <div className="rounded-lg border border-border">
              <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground">
                <span>{t('code')}</span>
                <span>{t('status')}</span>
                <span></span>
              </div>
              {mockLastOrder.codes.slice(0, 3).map((code, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-4 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <span className="font-mono text-sm truncate">{code.code}</span>
                  <span>{getStatusBadge(code.status)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/codes/detail/${code.code}`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего марок</p>
                <p className="text-2xl font-bold">12,450</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В обороте</p>
                <p className="text-2xl font-bold text-green-600">8,320</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В процессе</p>
                <p className="text-2xl font-bold text-amber-600">2,130</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Loader2 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Требуют внимания</p>
                <p className="text-2xl font-bold text-red-600">15</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
