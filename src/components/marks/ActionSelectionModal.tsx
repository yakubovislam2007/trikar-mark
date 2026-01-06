import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const actionTypes = [
  { id: 'acceptanceAct', labelKey: 'acceptanceAct' },
  { id: 'importNoticeEAEU', labelKey: 'importNoticeEAEU' },
  { id: 'importNoticeThird', labelKey: 'importNoticeThird' },
  { id: 'enterCirculationNotice', labelKey: 'enterCirculationNotice' },
  { id: 'exitCirculationNotice', labelKey: 'exitCirculationNotice' },
  { id: 'exportNoticeEAEU', labelKey: 'exportNoticeEAEU' },
  { id: 'acceptanceNoticeEAEU', labelKey: 'acceptanceNoticeEAEU' },
  { id: 'other', labelKey: 'other' },
];

const eaeuCountries = ['armenia', 'belarus', 'kyrgyzstan', 'russia'];
const recipientCountries = ['belarus', 'russia'];

const decisionCodes = [
  { id: '1', labelKey: 'releaseAllowed' },
  { id: '2', labelKey: 'releaseWithGuarantee' },
  { id: '3', labelKey: 'releaseArticle121' },
  { id: '4', labelKey: 'releaseArticle122' },
  { id: '5', labelKey: 'releaseArticle123' },
  { id: '6', labelKey: 'conditionalRelease' },
];

// List of countries for import from third countries
const allCountries = [
  'Австралия', 'Австрия', 'Азербайджан', 'Албания', 'Алжир', 'Ангола', 'Аргентина',
  'Бангладеш', 'Бельгия', 'Болгария', 'Бразилия', 'Великобритания', 'Венгрия',
  'Вьетнам', 'Германия', 'Греция', 'Грузия', 'Дания', 'Египет', 'Израиль', 'Индия',
  'Индонезия', 'Ирак', 'Иран', 'Ирландия', 'Испания', 'Италия', 'Канада', 'Китай',
  'Корея Южная', 'Латвия', 'Литва', 'Малайзия', 'Мексика', 'Монголия', 'Нидерланды',
  'Норвегия', 'ОАЭ', 'Пакистан', 'Польша', 'Португалия', 'Румыния', 'Саудовская Аравия',
  'Сербия', 'Сингапур', 'Словакия', 'Словения', 'США', 'Таджикистан', 'Таиланд',
  'Тайвань', 'Туркменистан', 'Турция', 'Узбекистан', 'Украина', 'Финляндия', 'Франция',
  'Хорватия', 'Чехия', 'Швейцария', 'Швеция', 'Эстония', 'Япония',
];

interface ActionSelectionModalProps {
  open: boolean;
  onClose: () => void;
  action: string;
  mark: any;
}

export const ActionSelectionModal = ({ open, onClose, action, mark }: ActionSelectionModalProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [countrySearch, setCountrySearch] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleClose = () => {
    setStep('select');
    setSelectedAction(null);
    setFormData({});
    setErrors({});
    onClose();
  };

  const handleSelectAction = (actionId: string) => {
    setSelectedAction(actionId);
    if (actionId === 'other') {
      // Proceed immediately for "Other"
      console.log('Processing:', actionId);
      handleClose();
    } else {
      setStep('form');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    const requiredFields = getRequiredFields();
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const getRequiredFields = (): string[] => {
    switch (selectedAction) {
      case 'acceptanceAct':
        return ['buyer', 'operationType'];
      case 'importNoticeEAEU':
        return ['senderIIN', 'senderName', 'countryOfOrigin'];
      case 'importNoticeThird':
        return ['exportCountry', 'registrationNumber', 'registrationDate', 'decisionCode', 'documentType', 'documentNumber', 'documentDate'];
      case 'enterCirculationNotice':
      case 'exitCirculationNotice':
        return ['reason', 'basisDocumentName', 'basisDocumentNumber', 'basisDocumentDate'];
      case 'exportNoticeEAEU':
        return ['recipientCountry', 'recipientIIN', 'primaryDocumentNumber', 'recipientName', 'primaryDocumentDate', 'actualShipmentDate'];
      case 'acceptanceNoticeEAEU':
        return ['shipmentDocumentId', 'acceptanceDate'];
      default:
        return [];
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submitting:', selectedAction, formData);
      handleClose();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const filteredCountries = allCountries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const renderForm = () => {
    switch (selectedAction) {
      case 'acceptanceAct':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={errors.buyer ? 'text-destructive' : ''}>
                {t('buyer')} *
              </Label>
              <Input
                value={formData.buyer || ''}
                onChange={(e) => updateFormData('buyer', e.target.value)}
                className={errors.buyer ? 'border-destructive' : ''}
              />
              {errors.buyer && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.operationType ? 'text-destructive' : ''}>
                {t('operationType')} *
              </Label>
              <Select
                value={formData.operationType}
                onValueChange={(v) => updateFormData('operationType', v)}
              >
                <SelectTrigger className={errors.operationType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Выберите тип операции" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realization">{t('realization')}</SelectItem>
                  <SelectItem value="commission">{t('commissionTrade')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.operationType && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
          </div>
        );

      case 'importNoticeEAEU':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={errors.senderIIN ? 'text-destructive' : ''}>
                {t('senderIIN')} *
              </Label>
              <Input
                value={formData.senderIIN || ''}
                onChange={(e) => updateFormData('senderIIN', e.target.value)}
                className={errors.senderIIN ? 'border-destructive' : ''}
              />
              {errors.senderIIN && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.senderName ? 'text-destructive' : ''}>
                {t('senderName')} *
              </Label>
              <Input
                value={formData.senderName || ''}
                onChange={(e) => updateFormData('senderName', e.target.value)}
                className={errors.senderName ? 'border-destructive' : ''}
              />
              {errors.senderName && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.countryOfOrigin ? 'text-destructive' : ''}>
                {t('countryOfOrigin')} *
              </Label>
              <Select
                value={formData.countryOfOrigin}
                onValueChange={(v) => updateFormData('countryOfOrigin', v)}
              >
                <SelectTrigger className={errors.countryOfOrigin ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Выберите страну" />
                </SelectTrigger>
                <SelectContent>
                  {eaeuCountries.map((c) => (
                    <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryOfOrigin && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
          </div>
        );

      case 'importNoticeThird':
        return (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label className={errors.exportCountry ? 'text-destructive' : ''}>
                {t('exportCountry')} *
              </Label>
              <div className="relative">
                <Input
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Начните вводить название страны"
                  className={errors.exportCountry ? 'border-destructive' : ''}
                />
                {countrySearch && filteredCountries.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredCountries.slice(0, 10).map((country) => (
                      <button
                        key={country}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-muted text-sm"
                        onClick={() => {
                          updateFormData('exportCountry', country);
                          setCountrySearch(country);
                        }}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.exportCountry && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.registrationNumber ? 'text-destructive' : ''}>
                {t('registrationNumber')} *
              </Label>
              <Input
                value={formData.registrationNumber || ''}
                onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                className={errors.registrationNumber ? 'border-destructive' : ''}
              />
              {errors.registrationNumber && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.registrationDate ? 'text-destructive' : ''}>
                {t('registrationDate')} *
              </Label>
              <DatePicker
                value={formData.registrationDate}
                onChange={(d) => updateFormData('registrationDate', d)}
                error={errors.registrationDate}
              />
              {errors.registrationDate && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.decisionCode ? 'text-destructive' : ''}>
                {t('decisionCode')} *
              </Label>
              <Select
                value={formData.decisionCode}
                onValueChange={(v) => updateFormData('decisionCode', v)}
              >
                <SelectTrigger className={cn(errors.decisionCode ? 'border-destructive' : '', 'h-auto min-h-10')}>
                  <SelectValue placeholder="Выберите код решения" />
                </SelectTrigger>
                <SelectContent>
                  {decisionCodes.map((code) => (
                    <SelectItem key={code.id} value={code.id} className="whitespace-normal">
                      {t(code.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.decisionCode && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.documentType ? 'text-destructive' : ''}>
                {t('documentType')} *
              </Label>
              <Input
                value={formData.documentType || ''}
                onChange={(e) => updateFormData('documentType', e.target.value)}
                className={errors.documentType ? 'border-destructive' : ''}
              />
              {errors.documentType && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.documentNumber ? 'text-destructive' : ''}>
                {t('documentNumber')} *
              </Label>
              <Input
                value={formData.documentNumber || ''}
                onChange={(e) => updateFormData('documentNumber', e.target.value)}
                className={errors.documentNumber ? 'border-destructive' : ''}
              />
              {errors.documentNumber && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.documentDate ? 'text-destructive' : ''}>
                {t('documentDate')} *
              </Label>
              <DatePicker
                value={formData.documentDate}
                onChange={(d) => updateFormData('documentDate', d)}
                error={errors.documentDate}
              />
              {errors.documentDate && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
          </div>
        );

      case 'enterCirculationNotice':
      case 'exitCirculationNotice':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={errors.reason ? 'text-destructive' : ''}>
                {t('reason')} *
              </Label>
              <Input
                value={formData.reason || ''}
                onChange={(e) => updateFormData('reason', e.target.value)}
                className={errors.reason ? 'border-destructive' : ''}
              />
              {errors.reason && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.basisDocumentName ? 'text-destructive' : ''}>
                {t('basisDocumentName')} *
              </Label>
              <Input
                value={formData.basisDocumentName || ''}
                onChange={(e) => updateFormData('basisDocumentName', e.target.value)}
                className={errors.basisDocumentName ? 'border-destructive' : ''}
              />
              {errors.basisDocumentName && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.basisDocumentNumber ? 'text-destructive' : ''}>
                {t('basisDocumentNumber')} *
              </Label>
              <Input
                value={formData.basisDocumentNumber || ''}
                onChange={(e) => updateFormData('basisDocumentNumber', e.target.value)}
                className={errors.basisDocumentNumber ? 'border-destructive' : ''}
              />
              {errors.basisDocumentNumber && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.basisDocumentDate ? 'text-destructive' : ''}>
                {t('basisDocumentDate')} *
              </Label>
              <DatePicker
                value={formData.basisDocumentDate}
                onChange={(d) => updateFormData('basisDocumentDate', d)}
                error={errors.basisDocumentDate}
              />
              {errors.basisDocumentDate && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
          </div>
        );

      case 'exportNoticeEAEU':
        return (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label className={errors.recipientCountry ? 'text-destructive' : ''}>
                {t('recipientCountry')} *
              </Label>
              <Select
                value={formData.recipientCountry}
                onValueChange={(v) => updateFormData('recipientCountry', v)}
              >
                <SelectTrigger className={errors.recipientCountry ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Выберите страну" />
                </SelectTrigger>
                <SelectContent>
                  {recipientCountries.map((c) => (
                    <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recipientCountry && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.recipientIIN ? 'text-destructive' : ''}>
                {t('recipientIIN')} *
              </Label>
              <Input
                value={formData.recipientIIN || ''}
                onChange={(e) => updateFormData('recipientIIN', e.target.value)}
                className={errors.recipientIIN ? 'border-destructive' : ''}
              />
              {errors.recipientIIN && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.primaryDocumentNumber ? 'text-destructive' : ''}>
                {t('primaryDocumentNumber')} *
              </Label>
              <Input
                value={formData.primaryDocumentNumber || ''}
                onChange={(e) => updateFormData('primaryDocumentNumber', e.target.value)}
                className={errors.primaryDocumentNumber ? 'border-destructive' : ''}
              />
              {errors.primaryDocumentNumber && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.recipientName ? 'text-destructive' : ''}>
                {t('recipientName')} *
              </Label>
              <Input
                value={formData.recipientName || ''}
                onChange={(e) => updateFormData('recipientName', e.target.value)}
                className={errors.recipientName ? 'border-destructive' : ''}
              />
              {errors.recipientName && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.primaryDocumentDate ? 'text-destructive' : ''}>
                {t('primaryDocumentDate')} *
              </Label>
              <DatePicker
                value={formData.primaryDocumentDate}
                onChange={(d) => updateFormData('primaryDocumentDate', d)}
                error={errors.primaryDocumentDate}
              />
              {errors.primaryDocumentDate && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.actualShipmentDate ? 'text-destructive' : ''}>
                {t('actualShipmentDate')} *
              </Label>
              <DatePicker
                value={formData.actualShipmentDate}
                onChange={(d) => updateFormData('actualShipmentDate', d)}
                error={errors.actualShipmentDate}
              />
              {errors.actualShipmentDate && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
          </div>
        );

      case 'acceptanceNoticeEAEU':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className={errors.shipmentDocumentId ? 'text-destructive' : ''}>
                {t('shipmentDocumentId')} *
              </Label>
              <Input
                value={formData.shipmentDocumentId || ''}
                onChange={(e) => updateFormData('shipmentDocumentId', e.target.value)}
                className={errors.shipmentDocumentId ? 'border-destructive' : ''}
              />
              {errors.shipmentDocumentId && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
            <div className="space-y-2">
              <Label className={errors.acceptanceDate ? 'text-destructive' : ''}>
                {t('acceptanceDate')} *
              </Label>
              <DatePicker
                value={formData.acceptanceDate}
                onChange={(d) => updateFormData('acceptanceDate', d)}
                error={errors.acceptanceDate}
              />
              {errors.acceptanceDate && <p className="text-sm text-destructive">{t('required')}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? t('selectAction') : t(selectedAction as any)}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' ? (
          <div className="space-y-2 py-4">
            {actionTypes.map((type) => (
              <button
                key={type.id}
                className="w-full rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted"
                onClick={() => handleSelectAction(type.id)}
              >
                {t(type.labelKey)}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="py-4">{renderForm()}</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('select')}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSubmit}>{t('continue')}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const DatePicker = ({
  value,
  onChange,
  error,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  error?: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            error && 'border-destructive'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PP', { locale: ru }) : 'Выберите дату'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} locale={ru} />
      </PopoverContent>
    </Popover>
  );
};
