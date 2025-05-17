import React, { useState } from 'react';
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Check, Plus, FileText, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AssetType } from '@/pages/Assets';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema for first step
const stepOneSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["imoveis", "investimentos", "participacoes", "outros"]),
});

// Schema for property step
const propertySchema = z.object({
  address: z.string().min(5, "Endereço é obrigatório"),
  propertyType: z.string().min(1, "Tipo de imóvel é obrigatório"),
  area: z.string().min(1, "Metragem é obrigatória"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  acquisitionDate: z.string().min(1, "Data de aquisição é obrigatória"),
  acquisitionValue: z.string().min(1, "Valor de aquisição é obrigatório"),
  marketValue: z.string().min(1, "Valor de mercado é obrigatório"),
});

// Schema for investment step
const investmentSchema = z.object({
  ticker: z.string().min(1, "Ticker é obrigatório"),
  quantity: z.string().min(1, "Quantidade é obrigatória"),
  averagePrice: z.string().min(1, "Preço médio é obrigatório"),
  currentPrice: z.string().min(1, "Preço atual é obrigatório"),
  acquisitionDate: z.string().min(1, "Data de aquisição é obrigatória"),
});

// Schema for company participation step
const companySchema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos"),
  participationPercentage: z.string().min(1, "Percentual de participação é obrigatório"),
  acquisitionDate: z.string().min(1, "Data de aquisição é obrigatória"),
  acquisitionValue: z.string().min(1, "Valor de aquisição é obrigatório"),
});

// Schema for other assets step
const otherSchema = z.object({
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().min(3, "Descrição é obrigatória"),
  serialNumber: z.string().optional(),
  acquisitionDate: z.string().min(1, "Data de aquisição é obrigatória"),
  acquisitionValue: z.string().min(1, "Valor de aquisição é obrigatório"),
  currentValue: z.string().min(1, "Valor atual é obrigatório"),
});

interface NewAssetFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (asset: any) => void;
}

const NewAssetForm: React.FC<NewAssetFormProps> = ({ open, onClose, onSave }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  
  const [files, setFiles] = useState<{name: string, uploaded: boolean}[]>([]);
  const [fileInput, setFileInput] = useState("");

  // Step 1 form
  const stepOneForm = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: "",
      type: "imoveis",
    },
  });

  // Property form (step 2 for property)
  const propertyForm = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      propertyType: "Residencial",
      area: "",
      bedrooms: "",
      bathrooms: "",
      acquisitionDate: format(new Date(), "yyyy-MM-dd"),
      acquisitionValue: "",
      marketValue: "",
    },
  });

  // Investment form (step 2 for investments)
  const investmentForm = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      ticker: "",
      quantity: "",
      averagePrice: "",
      currentPrice: "",
      acquisitionDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Company form (step 2 for participations)
  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      participationPercentage: "",
      acquisitionDate: format(new Date(), "yyyy-MM-dd"),
      acquisitionValue: "",
    },
  });

  // Other assets form (step 2 for others)
  const otherForm = useForm<z.infer<typeof otherSchema>>({
    resolver: zodResolver(otherSchema),
    defaultValues: {
      category: "",
      description: "",
      serialNumber: "",
      acquisitionDate: format(new Date(), "yyyy-MM-dd"),
      acquisitionValue: "",
      currentValue: "",
    },
  });

  // Handle completion of step 1
  const onSubmitStepOne = (data: z.infer<typeof stepOneSchema>) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  // Handle completion of step 2 for different asset types
  const onSubmitStepTwo = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  // Handle document upload in step 3
  const handleAddDocument = () => {
    if (!fileInput.trim()) return;
    
    setFiles([...files, { name: fileInput, uploaded: true }]);
    setFileInput("");
    toast({
      title: "Documento adicionado",
      description: "O documento foi adicionado com sucesso.",
    });
  };

  const handleRemoveDocument = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Handle form submission
  const handleSaveAsset = () => {
    const newAsset = {
      ...formData,
      id: `asset-${Date.now()}`,
      documents: files,
      status: "Ativo",
      performance: Math.random() * 15 - 5, // Random performance between -5% and 10%
      value: parseFloat(formData.marketValue || formData.currentValue || formData.acquisitionValue),
    };
    
    onSave(newAsset);
    toast({
      title: "Ativo cadastrado com sucesso!",
      description: `${newAsset.name} foi adicionado à sua carteira.`,
    });
    
    // Reset form state
    setStep(1);
    setFormData({});
    setFiles([]);
    stepOneForm.reset();
    propertyForm.reset();
    investmentForm.reset();
    companyForm.reset();
    otherForm.reset();
    
    onClose();
  };

  // Get form details based on selected asset type
  const getFormForAssetType = () => {
    const type = formData.type as AssetType;
    
    switch (type) {
      case 'imoveis':
        return {
          form: propertyForm,
          schema: propertySchema,
          title: "Detalhes do Imóvel",
          fields: [
            { name: 'address', label: 'Endereço', type: 'text' },
            { name: 'propertyType', label: 'Tipo de Imóvel', type: 'select', options: ['Residencial', 'Comercial', 'Industrial', 'Rural'] },
            { name: 'area', label: 'Área (m²)', type: 'text' },
            { name: 'bedrooms', label: 'Quartos', type: 'number' },
            { name: 'bathrooms', label: 'Banheiros', type: 'number' },
            { name: 'acquisitionDate', label: 'Data de Aquisição', type: 'date' },
            { name: 'acquisitionValue', label: 'Valor de Aquisição (R$)', type: 'number' },
            { name: 'marketValue', label: 'Valor de Mercado Atual (R$)', type: 'number' },
          ],
          documents: ['Escritura', 'IPTU', 'Contrato de Compra e Venda', 'Matrícula', 'Laudo de Avaliação'],
        };
      case 'investimentos':
        return {
          form: investmentForm,
          schema: investmentSchema,
          title: "Detalhes do Investimento",
          fields: [
            { name: 'ticker', label: 'Ticker', type: 'text' },
            { name: 'quantity', label: 'Quantidade', type: 'number' },
            { name: 'averagePrice', label: 'Preço Médio (R$)', type: 'number' },
            { name: 'currentPrice', label: 'Preço Atual (R$)', type: 'number' },
            { name: 'acquisitionDate', label: 'Data de Aquisição', type: 'date' },
          ],
          documents: ['Nota de Corretagem', 'Extrato de Custódia', 'Informe de Rendimentos'],
        };
      case 'participacoes':
        return {
          form: companyForm,
          schema: companySchema,
          title: "Detalhes da Participação Societária",
          fields: [
            { name: 'companyName', label: 'Nome da Empresa', type: 'text' },
            { name: 'cnpj', label: 'CNPJ', type: 'text' },
            { name: 'participationPercentage', label: 'Percentual de Participação (%)', type: 'number' },
            { name: 'acquisitionDate', label: 'Data de Aquisição', type: 'date' },
            { name: 'acquisitionValue', label: 'Valor do Investimento (R$)', type: 'number' },
          ],
          documents: ['Contrato Social', 'Alterações Contratuais', 'Acordo de Acionistas', 'Balanço Patrimonial'],
        };
      case 'outros':
        return {
          form: otherForm,
          schema: otherSchema,
          title: "Detalhes do Ativo",
          fields: [
            { name: 'category', label: 'Categoria', type: 'select', options: ['Veículo', 'Obra de Arte', 'Joia', 'Colecionável', 'Outro'] },
            { name: 'description', label: 'Descrição', type: 'text' },
            { name: 'serialNumber', label: 'Número de Série/Identificação', type: 'text' },
            { name: 'acquisitionDate', label: 'Data de Aquisição', type: 'date' },
            { name: 'acquisitionValue', label: 'Valor de Aquisição (R$)', type: 'number' },
            { name: 'currentValue', label: 'Valor Atual Estimado (R$)', type: 'number' },
          ],
          documents: ['Nota Fiscal', 'Certificado de Autenticidade', 'Apólice de Seguro', 'Laudo de Avaliação'],
        };
      default:
        return {
          form: otherForm,
          schema: otherSchema,
          title: "Detalhes do Ativo",
          fields: [],
          documents: [],
        };
    }
  };

  const currentFormDetails = formData.type ? getFormForAssetType() : null;

  // Render form fields dynamically based on field type
  const renderFormField = (field: { name: string; label: string; type: string; options?: string[] }) => {
    const currentForm = currentFormDetails?.form;
    
    if (!currentForm) return null;

    return (
      <FormField
        key={field.name}
        control={currentForm.control}
        name={field.name as any}
        render={({ field: formField }) => (
          <FormItem className="mb-4">
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {field.type === 'select' ? (
                <Select 
                  value={formField.value} 
                  onValueChange={formField.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  {...formField}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 1 
              ? "Adicionar Novo Ativo" 
              : step === 2 
              ? currentFormDetails?.title 
              : "Documentos do Ativo"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {step > 1 ? <Check size={16} /> : "1"}
              </div>
              <div className="h-0.5 w-8 bg-gray-700"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {step > 2 ? <Check size={16} /> : "2"}
              </div>
              <div className="h-0.5 w-8 bg-gray-700"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}>
                3
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Passo {step} de 3
            </div>
          </div>

          {/* Step 1: Asset Type and Name */}
          {step === 1 && (
            <Form {...stepOneForm}>
              <form onSubmit={stepOneForm.handleSubmit(onSubmitStepOne)} className="space-y-4">
                <FormField
                  control={stepOneForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Ativo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Apartamento Centro" {...field} className="bg-gray-800 border-gray-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={stepOneForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Ativo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Selecione o tipo de ativo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="imoveis">Imóveis</SelectItem>
                          <SelectItem value="investimentos">Investimentos</SelectItem>
                          <SelectItem value="participacoes">Participações Societárias</SelectItem>
                          <SelectItem value="outros">Outros Ativos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-gray-700 text-white">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Próximo <ChevronRight size={16} />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {/* Step 2: Asset Details (dynamic based on type) */}
          {step === 2 && currentFormDetails && (
            <Form {...currentFormDetails.form}>
              <form onSubmit={currentFormDetails.form.handleSubmit(onSubmitStepTwo)} className="space-y-4">
                {currentFormDetails.fields.map(renderFormField)}
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="bg-transparent border-gray-700 text-white"
                  >
                    <ChevronLeft size={16} /> Voltar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Próximo <ChevronRight size={16} />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-gray-400 text-sm mb-4">
                Adicione os documentos relacionados a este ativo. Você também poderá adicionar mais documentos posteriormente.
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Input
                  placeholder="Nome do documento"
                  value={fileInput}
                  onChange={(e) => setFileInput(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  type="button"
                  onClick={handleAddDocument}
                  variant="outline"
                  className="border-blue-600 text-blue-400"
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Documentos sugeridos:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                  {currentFormDetails?.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Documentos adicionados:</h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-400" />
                          <span>{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveDocument(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X size={16} className="text-gray-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)} 
                  className="bg-transparent border-gray-700 text-white"
                >
                  <ChevronLeft size={16} /> Voltar
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveAsset} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Salvar Ativo
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssetForm;
