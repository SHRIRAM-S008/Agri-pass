import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Package, X, FileText, Image } from 'lucide-react';
import { storage } from '@/lib/storage';

export default function SubmitBatch() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productType: '',
    quantity: '',
    farmLocation: '',
    destination: '',
    notes: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productType) {
      newErrors.productType = t('selectProduct');
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = t('enterQuantity');
    } else if (!/^\d+(\.\d+)?\s*(kg|tons?|lbs?|mt)$/i.test(formData.quantity.trim())) {
      newErrors.quantity = t('enterQuantity');
    }
    if (!formData.farmLocation.trim()) {
      newErrors.farmLocation = t('selectOrigin');
    }
    if (!formData.destination) {
      newErrors.destination = t('enterDestination');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
      );
      setImages(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file =>
        file.type === 'application/pdf' && file.size <= 20 * 1024 * 1024
      );
      setDocuments(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('error'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const batch = {
        productType: formData.productType,
        quantity: formData.quantity,
        farmLocation: formData.farmLocation,
        destinationCountry: formData.destination,
        notes: formData.notes
      };

      // Save to "Database"
      const savedBatch = await storage.saveBatch(batch);
      console.log('Batch Saved:', savedBatch);

      toast.success(t('batchSubmittedSuccess'), {
        description: `Batch ID: ${savedBatch.id} - Sent to Farm2Port Database`
      });

      navigate('/exporter/batches');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t('submitNewBatch')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {t('productDetails')}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType">{t('productType')} *</Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, productType: value }));
                    if (errors.productType) setErrors(prev => ({ ...prev, productType: '' }));
                  }}
                >
                  <SelectTrigger className={errors.productType ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('selectProduct')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="turmeric">Turmeric</SelectItem>
                    <SelectItem value="pepper">Pepper</SelectItem>
                    <SelectItem value="cardamom">Cardamom</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.productType && <p className="text-sm text-destructive">{errors.productType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t('quantity')} *</Label>
                <Input
                  id="quantity"
                  placeholder={t('enterQuantity')}
                  value={formData.quantity}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, quantity: e.target.value }));
                    if (errors.quantity) setErrors(prev => ({ ...prev, quantity: '' }));
                  }}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmLocation">{t('farmLocation')} *</Label>
              <Input
                id="farmLocation"
                placeholder={t('selectOrigin')}
                value={formData.farmLocation}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, farmLocation: e.target.value }));
                  if (errors.farmLocation) setErrors(prev => ({ ...prev, farmLocation: '' }));
                }}
                className={errors.farmLocation ? 'border-destructive' : ''}
              />
              {errors.farmLocation && <p className="text-sm text-destructive">{errors.farmLocation}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">{t('destination')} *</Label>
              <Select
                value={formData.destination}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, destination: value }));
                  if (errors.destination) setErrors(prev => ({ ...prev, destination: '' }));
                }}
              >
                <SelectTrigger className={errors.destination ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t('enterDestination')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uae">United Arab Emirates</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="saudi">Saudi Arabia</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              {t('uploadDocuments')}
            </h2>

            <div className="space-y-2">
              <Label>{t('uploadImages')} (Max 5)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('dragAndDrop')}</p>
                </label>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      <button type="button" onClick={() => removeImage(index)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('uploadDocuments')} (PDF, Max 5)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('dragAndDrop')}</p>
                </label>
              </div>
              {documents.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      <button type="button" onClick={() => removeDocument(index)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
