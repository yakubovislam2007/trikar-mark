import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const mockCodes = [
  {
    id: '1',
    code: '010460001234567821abcd1234',
    date: '2024-01-05',
    status: 'in_circulation',
    packagingType: 'Потребительская',
    productName: 'Кроссовки Nike Air Max',
    emitter: 'ТОО "TRIKAR"',
    unitsInside: 1,
    owner: 'ИП Иванов А.А.',
  },
  {
    id: '2',
    code: '010460001234567821efgh5678',
    date: '2024-01-04',
    status: 'applied',
    packagingType: 'Групповая',
    productName: 'Ботинки Adidas Ultra',
    emitter: 'ТОО "TRIKAR"',
    unitsInside: 6,
    owner: 'ТОО "Обувь KZ"',
  },
  {
    id: '3',
    code: '010460001234567821ijkl9012',
    date: '2024-01-03',
    status: 'out_of_circulation',
    packagingType: 'Потребительская',
    productName: 'Туфли классические',
    emitter: 'ТОО "TRIKAR"',
    unitsInside: 1,
    owner: 'ИП Петров Б.Б.',
  },
  {
    id: '4',
    code: '010460001234567821mnop3456',
    date: '2024-01-02',
    status: 'ordered',
    packagingType: 'Транспортная',
    productName: 'Сапоги зимние',
    emitter: 'ТОО "TRIKAR"',
    unitsInside: 24,
    owner: 'ТОО "Обувь KZ"',
  },
];

const statusConfig = {
  ordered: { label: 'Заказан', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  applied: { label: 'Нанесен', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  in_circulation: { label: 'В обороте', color: 'bg-green-100 text-green-700 border-green-200' },
  out_of_circulation: { label: 'Выведен из оборота', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const CodesPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ordered;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredCodes = mockCodes.filter((code) => {
    if (searchQuery && !code.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !code.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter && code.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('allCodes')}</h1>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PP', { locale: ru }) : t('date')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter ? statusConfig[statusFilter as keyof typeof statusConfig]?.label : t('status')}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  Все
                </DropdownMenuItem>
                {Object.entries(statusConfig).map(([key, value]) => (
                  <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                    {value.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('date')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('status')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('code')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('packagingType')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('productName')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('emitter')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('unitsInside')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    {t('owner')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((code) => (
                  <tr
                    key={code.id}
                    className="border-b border-border transition-colors hover:bg-muted/30 cursor-pointer"
                    onClick={() => navigate(`/codes/detail/${code.id}`)}
                  >
                    <td className="px-4 py-3 text-sm">{code.date}</td>
                    <td className="px-4 py-3">{getStatusBadge(code.status)}</td>
                    <td className="px-4 py-3 font-mono text-sm">{code.code}</td>
                    <td className="px-4 py-3 text-sm">{code.packagingType}</td>
                    <td className="px-4 py-3 text-sm font-medium">{code.productName}</td>
                    <td className="px-4 py-3 text-sm">{code.emitter}</td>
                    <td className="px-4 py-3 text-sm text-center">{code.unitsInside}</td>
                    <td className="px-4 py-3 text-sm">{code.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodesPage;
