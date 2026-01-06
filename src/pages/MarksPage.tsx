import React, { useState } from 'react';
import { Upload, Plus, Package, Download, ChevronDown, ChevronUp, Stamp, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActionSelectionModal } from '@/components/marks/ActionSelectionModal';

const mockNktProducts = [
  { id: '1', name: 'Кроссовки Nike Air Max 270', gtin: '4600012345678', brand: 'Nike', category: 'Обувные товары' },
  { id: '2', name: 'Ботинки Adidas Terrex', gtin: '4600012345679', brand: 'Adidas', category: 'Обувные товары' },
];

const mockGs1Products = [
  { id: '3', name: 'Туфли мужские классические', gtin: '4600012345680', brand: 'Ecco', category: 'Обувные товары' },
  { id: '4', name: 'Кеды Converse All Star', gtin: '4600012345681', brand: 'Converse', category: 'Обувные товары' },
];

const mockMarks = [
  { 
    id: '1', 
    product: mockNktProducts[0], 
    status: 'ordered', 
    quantity: 500,
    codes: [
      { code: '010460001234567821abcd1234', status: 'ordered' },
      { code: '010460001234567821efgh5678', status: 'ordered' },
    ]
  },
  { 
    id: '2', 
    product: mockNktProducts[1], 
    status: 'applied', 
    quantity: 200,
    codes: []
  },
  { 
    id: '3', 
    product: mockGs1Products[0], 
    status: 'in_circulation', 
    quantity: 150,
    codes: []
  },
  { 
    id: '4', 
    product: mockGs1Products[1], 
    status: 'withdrawn', 
    quantity: 50,
    codes: []
  },
];

const statusConfig = {
  ordered: { label: 'Заказаны', color: 'bg-amber-100 text-amber-700' },
  in_process: { label: 'В процессе', color: 'bg-blue-100 text-blue-700' },
  applied: { label: 'Наклеены', color: 'bg-purple-100 text-purple-700' },
  in_circulation: { label: 'В обороте', color: 'bg-green-100 text-green-700' },
  withdrawn: { label: 'Списаны', color: 'bg-gray-100 text-gray-700' },
};

const MarksPage = () => {
  const { t } = useLanguage();
  const [mainTab, setMainTab] = useState('nkt');
  const [marksTab, setMarksTab] = useState('all');
  const [orderModal, setOrderModal] = useState<{ open: boolean; product: any }>({ open: false, product: null });
  const [downloadModal, setDownloadModal] = useState<{ open: boolean; mark: any }>({ open: false, mark: null });
  const [applyModal, setApplyModal] = useState<{ open: boolean; mark: any }>({ open: false, mark: null });
  const [actionModal, setActionModal] = useState<{ open: boolean; action: string; mark: any }>({ open: false, action: '', mark: null });
  const [orderQuantity, setOrderQuantity] = useState('');
  const [downloadQuantity, setDownloadQuantity] = useState('');
  const [applyQuantity, setApplyQuantity] = useState('');
  const [applier, setApplier] = useState('');
  const [expandedMarks, setExpandedMarks] = useState<Set<string>>(new Set());

  const handleOrder = (product: any) => {
    setOrderModal({ open: true, product });
  };

  const handleConfirmOrder = () => {
    // Mock order creation
    console.log('Order created:', orderModal.product, orderQuantity);
    setOrderModal({ open: false, product: null });
    setOrderQuantity('');
    setMainTab('marks');
  };

  const toggleExpanded = (markId: string) => {
    const newExpanded = new Set(expandedMarks);
    if (newExpanded.has(markId)) {
      newExpanded.delete(markId);
    } else {
      newExpanded.add(markId);
    }
    setExpandedMarks(newExpanded);
  };

  const handleApply = (mark: any) => {
    setApplyModal({ open: true, mark });
  };

  const handleConfirmApply = () => {
    console.log('Apply:', applyModal.mark, applyQuantity, applier);
    setApplyModal({ open: false, mark: null });
    setApplyQuantity('');
    setApplier('');
  };

  const handleAction = (action: string, mark: any) => {
    setActionModal({ open: true, action, mark });
  };

  const filteredMarks = mockMarks.filter((mark) => {
    if (marksTab === 'all') return true;
    if (marksTab === 'processes') return mark.status === 'in_process';
    if (marksTab === 'ordered') return mark.status === 'ordered';
    if (marksTab === 'applied') return mark.status === 'applied';
    if (marksTab === 'in_circulation') return mark.status === 'in_circulation';
    if (marksTab === 'withdrawn') return mark.status === 'withdrawn';
    return true;
  });

  const ProductCard = ({ product, showOrder = false }: { product: any; showOrder?: boolean }) => (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">GTIN: {product.gtin}</p>
            <p className="text-sm text-muted-foreground">{t('brand')}: {product.brand}</p>
            <Badge variant="secondary" className="mt-2">{product.category}</Badge>
          </div>
        </div>
        {showOrder && (
          <Button 
            className="absolute bottom-4 right-4" 
            size="sm"
            onClick={() => handleOrder(product)}
          >
            {t('order')}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const MarkCard = ({ mark }: { mark: any }) => {
    const isExpanded = expandedMarks.has(mark.id);
    const status = statusConfig[mark.status as keyof typeof statusConfig];

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{mark.product.name}</h3>
                <p className="text-sm text-muted-foreground">GTIN: {mark.product.gtin}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={status.color}>{status.label}</Badge>
                  <Badge variant="outline">{mark.quantity} шт</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {mark.status !== 'withdrawn' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDownloadModal({ open: true, mark })}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('downloadLabel')}
                </Button>
              )}
              {mark.status === 'ordered' && (
                <Button size="sm" onClick={() => handleApply(mark)}>
                  <Stamp className="mr-2 h-4 w-4" />
                  {t('apply')}
                </Button>
              )}
              {mark.status === 'applied' && (
                <Button size="sm" onClick={() => handleAction('enterCirculation', mark)}>
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  {t('enterCirculation')}
                </Button>
              )}
              {mark.status === 'in_circulation' && (
                <Button size="sm" variant="destructive" onClick={() => handleAction('exitCirculation', mark)}>
                  <ArrowLeftCircle className="mr-2 h-4 w-4" />
                  {t('exitCirculation')}
                </Button>
              )}
            </div>
          </div>

          {mark.codes.length > 0 && (
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-center"
                onClick={() => toggleExpanded(mark.id)}
              >
                {isExpanded ? (
                  <>
                    Скрыть коды <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t('showMore')} ({mark.codes.length} кодов) <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {isExpanded && (
                <div className="mt-4 rounded-lg border border-border">
                  <div className="grid grid-cols-2 gap-4 border-b border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground">
                    <span>{t('code')}</span>
                    <span>{t('status')}</span>
                  </div>
                  {mark.codes.map((code: any, idx: number) => (
                    <div
                      key={idx}
                      className="grid grid-cols-2 gap-4 border-b border-border px-4 py-3 last:border-b-0"
                    >
                      <span className="font-mono text-sm truncate">{code.code}</span>
                      <Badge variant="outline" className={statusConfig[code.status as keyof typeof statusConfig]?.color}>
                        {statusConfig[code.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('marks')}</h1>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted">
            <TabsTrigger value="nkt">{t('nkt')}</TabsTrigger>
            <TabsTrigger value="gs1">{t('gs1')}</TabsTrigger>
            <TabsTrigger value="marks">{t('marksTab')}</TabsTrigger>
          </TabsList>

          {(mainTab === 'nkt' || mainTab === 'gs1') && (
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {t('uploadExcel')}
            </Button>
          )}
        </div>

        <TabsContent value="nkt" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockNktProducts.map((product) => (
              <ProductCard key={product.id} product={product} showOrder />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gs1" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockGs1Products.map((product) => (
              <ProductCard key={product.id} product={product} showOrder />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marks" className="mt-6 space-y-4">
          <Tabs value={marksTab} onValueChange={setMarksTab}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all">{t('all')}</TabsTrigger>
              <TabsTrigger value="processes">{t('processes')}</TabsTrigger>
              <TabsTrigger value="ordered">{t('orderedMarks')}</TabsTrigger>
              <TabsTrigger value="applied">{t('appliedMarks')}</TabsTrigger>
              <TabsTrigger value="in_circulation">{t('inCirculationMarks')}</TabsTrigger>
              <TabsTrigger value="withdrawn">{t('withdrawn')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4">
            {filteredMarks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('noData')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredMarks.map((mark) => (
                <MarkCard key={mark.id} mark={mark} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Modal */}
      <Dialog open={orderModal.open} onOpenChange={(open) => setOrderModal({ open, product: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('order')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {orderModal.product && (
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-semibold">{orderModal.product.name}</h4>
                <p className="text-sm text-muted-foreground">GTIN: {orderModal.product.gtin}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>{t('quantity')}</Label>
              <Input
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                placeholder="Введите количество"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderModal({ open: false, product: null })}>
              {t('cancel')}
            </Button>
            <Button onClick={handleConfirmOrder} disabled={!orderQuantity}>
              {t('order')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={downloadModal.open} onOpenChange={(open) => setDownloadModal({ open, mark: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('downloadLabel')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('quantity')}</Label>
              <Input
                type="number"
                min="1"
                value={downloadQuantity}
                onChange={(e) => setDownloadQuantity(e.target.value)}
                placeholder="Введите количество"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                {t('downloadExcel')}
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                {t('downloadPdf')}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadModal({ open: false, mark: null })}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={applyModal.open} onOpenChange={(open) => setApplyModal({ open, mark: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('apply')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('quantity')}</Label>
              <Input
                type="number"
                min="1"
                value={applyQuantity}
                onChange={(e) => setApplyQuantity(e.target.value)}
                placeholder="Введите количество"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('selectApplier')}</Label>
              <Select value={applier} onValueChange={setApplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите исполнителя" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">{t('warehouse')}</SelectItem>
                  <SelectItem value="factory">{t('factory')}</SelectItem>
                  <SelectItem value="self">{t('self')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyModal({ open: false, mark: null })}>
              {t('cancel')}
            </Button>
            <Button onClick={handleConfirmApply} disabled={!applyQuantity || !applier}>
              {t('apply')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Selection Modal */}
      <ActionSelectionModal
        open={actionModal.open}
        onClose={() => setActionModal({ open: false, action: '', mark: null })}
        action={actionModal.action}
        mark={actionModal.mark}
      />
    </div>
  );
};

export default MarksPage;
