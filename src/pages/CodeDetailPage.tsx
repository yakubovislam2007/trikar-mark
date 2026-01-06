import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, Building2, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const mockCodeDetail = {
  code: '010460001234567821abcd1234',
  barcode: '4600012345678',
  status: 'in_circulation',
  statusLabel: 'В обороте',
  emittedDate: '2024-01-01 10:30',
  appliedDate: '2024-01-02 14:15',
  aggregatedDate: '2024-01-03 09:00',
  emitter: 'ТОО "TRIKAR"',
  currentOwner: 'ИП Иванов А.А.',
  product: {
    brand: 'Nike',
    name: 'Air Max 270',
    photo: null,
    gtin: '4600012345678',
    packaging: 'Потребительская',
    unitsInPackage: 1,
    manufacturer: 'Nike Inc., Vietnam',
  },
  documents: [
    { code: 'DOC-001', status: 'Подтвержден', date: '2024-01-02', document: 'Акт ввода в оборот', number: 'АКТ-2024-001', participants: 'ТОО "TRIKAR" → ИП Иванов А.А.' },
    { code: 'DOC-002', status: 'Подтвержден', date: '2024-01-01', document: 'Заказ кодов', number: 'ЗК-2024-123', participants: 'ТОО "TRIKAR"' },
  ],
  movements: [
    { date: '2024-01-03', action: 'Ввод в оборот', actor: 'ИП Иванов А.А.', document: 'Акт ввода в оборот №АКТ-2024-001' },
    { date: '2024-01-02', action: 'Нанесение', actor: 'ТОО "TRIKAR"', document: 'Документ о нанесении №НАН-2024-456' },
    { date: '2024-01-01', action: 'Эмиссия', actor: 'ТОО "TRIKAR"', document: 'Заказ кодов №ЗК-2024-123' },
  ],
};

const CodeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Код маркировки</h1>
          <p className="font-mono text-sm text-muted-foreground">{mockCodeDetail.code}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="general">{t('generalInfo')}</TabsTrigger>
          <TabsTrigger value="documents">{t('codeDocuments')}</TabsTrigger>
          <TabsTrigger value="movement">{t('codeMovement')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Code Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {t('codeInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-20 w-48 bg-foreground" 
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)',
                        backgroundSize: '100% 100%'
                      }} 
                    />
                    <p className="font-mono text-sm">{mockCodeDetail.barcode}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('code')}</p>
                    <p className="font-mono text-sm">{mockCodeDetail.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('status')}</p>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {mockCodeDetail.statusLabel}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('emittedDate')}</p>
                    <p className="font-medium">{mockCodeDetail.emittedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('appliedDate')}</p>
                    <p className="font-medium">{mockCodeDetail.appliedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('aggregatedDate')}</p>
                    <p className="font-medium">{mockCodeDetail.aggregatedDate}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="mb-3 font-medium">{t('participants')}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('emitter')}</p>
                        <p className="font-medium">{mockCodeDetail.emitter}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('currentOwner')}</p>
                        <p className="font-medium">{mockCodeDetail.currentOwner}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {t('productInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
                  <div className="text-center text-muted-foreground">
                    <Package className="mx-auto h-16 w-16 mb-2" />
                    <p className="text-sm">{t('photo')}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('brand')}</p>
                    <p className="font-medium">{mockCodeDetail.product.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('productName')}</p>
                    <p className="font-medium">{mockCodeDetail.product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('gtin')}</p>
                    <p className="font-mono">{mockCodeDetail.product.gtin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('packaging')}</p>
                    <p className="font-medium">{mockCodeDetail.product.packaging}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('unitsInPackage')}</p>
                    <p className="font-medium">{mockCodeDetail.product.unitsInPackage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('manufacturer')}</p>
                    <p className="font-medium">{mockCodeDetail.product.manufacturer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('code')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('status')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('date')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('document')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('documentNumber')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">{t('participants')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCodeDetail.documents.map((doc, idx) => (
                      <tr key={idx} className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 font-mono text-sm">{doc.code}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{doc.date}</td>
                        <td className="px-4 py-3 text-sm">{doc.document}</td>
                        <td className="px-4 py-3 font-mono text-sm">{doc.number}</td>
                        <td className="px-4 py-3 text-sm">{doc.participants}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                {mockCodeDetail.movements.map((movement, idx) => (
                  <div key={idx} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Timeline line */}
                    {idx !== mockCodeDetail.movements.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
                    )}
                    {/* Timeline dot */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{movement.action}</h4>
                        <span className="text-sm text-muted-foreground">{movement.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{movement.actor}</p>
                      <p className="mt-1 text-sm">{movement.document}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeDetailPage;
