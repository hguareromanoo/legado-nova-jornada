
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ChevronRight, CheckCircle2, ArrowRight, Download, XCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

// Mock data for holding structure
const holdingStructureData = {
  companyName: 'Silva Participações Ltda.',
  cnpj: '12.345.678/0001-90',
  capital: 'R$ 500.000,00',
  headquarters: 'São Paulo/SP',
  partners: [
    { name: 'Carlos Roberto Silva', percentage: 60, role: 'Sócio Administrador' },
    { name: 'Maria Eduarda Silva', percentage: 40, role: 'Sócia' }
  ],
  assets: [
    { 
      name: 'Imóvel Residencial 1', 
      type: 'Imóvel', 
      value: 'R$ 1.200.000,00',
      details: 'Apartamento de 150m² na Zona Sul'
    },
    { 
      name: 'Imóvel Comercial', 
      type: 'Imóvel', 
      value: 'R$ 2.500.000,00',
      details: 'Sala comercial de 200m² na região central'
    },
    { 
      name: 'Imóvel Residencial 2', 
      type: 'Imóvel', 
      value: 'R$ 850.000,00',
      details: 'Casa de 180m² em condomínio fechado'
    }
  ]
};

// Mock costs and benefits data
const financialDetails = {
  setup: {
    legal: 'R$ 15.000,00',
    registration: 'R$ 8.500,00',
    consulting: 'R$ 12.000,00',
    total: 'R$ 35.500,00'
  },
  annual: {
    accounting: 'R$ 9.600,00',
    taxes: 'R$ 5.800,00',
    maintenance: 'R$ 3.200,00',
    total: 'R$ 18.600,00'
  },
  benefits: {
    taxSavings: 'R$ 64.000,00/ano',
    successionReduction: 'R$ 180.000,00',
    liabilityProtection: '100% dos ativos protegidos',
    roi: '15 meses'
  }
};

// Mock documents for signature
const documentList = [
  { 
    id: 'doc1', 
    name: 'Contrato Social', 
    description: 'Documento constitutivo da holding familiar',
    status: 'pending',
    required: true
  },
  { 
    id: 'doc2', 
    name: 'Termo de Transferência de Bens', 
    description: 'Documenta a transferência dos ativos para a holding',
    status: 'pending',
    required: true
  },
  { 
    id: 'doc3', 
    name: 'Acordo de Sócios', 
    description: 'Estabelece regras de governança entre os sócios',
    status: 'pending',
    required: true
  },
  { 
    id: 'doc4', 
    name: 'Plano de Sucessão', 
    description: 'Define regras para sucessão patrimonial',
    status: 'pending',
    required: false
  }
];

const PlanApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeOnboarding } = useUser();
  const { completeStep } = useOnboarding();
  
  const [activeTab, setActiveTab] = useState('structure');
  const [documents, setDocuments] = useState(documentList);
  const [adjustmentRequested, setAdjustmentRequested] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  
  // Function to handle document signature
  const handleSignDocument = (docId: string) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status: 'signed' };
      }
      return doc;
    });
    
    setDocuments(updatedDocs);
    
    toast({
      title: "Documento assinado!",
      description: "Sua assinatura foi registrada com sucesso.",
    });
    
    // Check if all required documents have been signed
    const allRequiredSigned = updatedDocs
      .filter(doc => doc.required)
      .every(doc => doc.status === 'signed');
      
    if (allRequiredSigned) {
      toast({
        title: "Todos os documentos essenciais assinados!",
        description: "Você pode prosseguir para finalizar o processo.",
        variant: "success",
      });
    }
  };
  
  // Function to handle plan approval
  const handleApprovePlan = () => {
    const allRequiredSigned = documents
      .filter(doc => doc.required)
      .every(doc => doc.status === 'signed');
      
    if (!allRequiredSigned) {
      toast({
        title: "Documentos pendentes",
        description: "Por favor, assine todos os documentos obrigatórios antes de aprovar o plano.",
        variant: "destructive",
      });
      return;
    }
    
    // Mark onboarding as completed
    completeOnboarding();
    completeStep('documents');
    completeStep('review');
    
    toast({
      title: "Plano aprovado com sucesso!",
      description: "Sua holding familiar será implementada conforme o plano aprovado.",
    });
    
    // Show final success message and redirect to dashboard
    setTimeout(() => {
      toast({
        title: "Parabéns!",
        description: "O processo de onboarding foi concluído. Você será redirecionado para o dashboard.",
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1500);
  };
  
  // Function to handle adjustment request
  const handleRequestAdjustment = () => {
    if (!adjustmentReason.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva os ajustes necessários.",
        variant: "destructive",
      });
      return;
    }
    
    setAdjustmentRequested(true);
    setShowAdjustmentForm(false);
    
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de ajustes foi enviada ao consultor responsável.",
    });
  };
  
  // Check if all required documents have been signed
  const canApprove = documents
    .filter(doc => doc.required)
    .every(doc => doc.status === 'signed');
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Aprovação do Plano de Holding Familiar
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Revise a estrutura proposta e aprove o plano para iniciarmos a implementação da sua holding familiar.
        </p>
      </div>
      
      {/* Plan overview */}
      <Card className="mb-8 border-blue-100 shadow-md">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle>Visão Geral do Plano</CardTitle>
          <CardDescription>
            Esta é a estrutura personalizada proposta para sua holding familiar
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-blue-800 mb-3">Holding {holdingStructureData.companyName}</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">CNPJ:</span>
                  <span className="font-medium">{holdingStructureData.cnpj}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Capital:</span>
                  <span className="font-medium">{holdingStructureData.capital}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Sede:</span>
                  <span className="font-medium">{holdingStructureData.headquarters}</span>
                </div>
              </div>
              
              <h4 className="font-bold text-md mt-6 mb-3">Sócios</h4>
              <div className="space-y-4">
                {holdingStructureData.partners.map((partner, idx) => (
                  <div key={idx} className="flex justify-between border-b pb-2">
                    <div>
                      <span className="font-medium">{partner.name}</span>
                      <span className="block text-sm text-gray-600">{partner.role}</span>
                    </div>
                    <span className="font-medium">{partner.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-blue-800 mb-3">Ativos Incluídos</h3>
              <div className="space-y-4">
                {holdingStructureData.assets.map((asset, idx) => (
                  <div key={idx} className="border-b pb-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{asset.name}</span>
                      <span className="font-medium">{asset.value}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-600">{asset.type}</span>
                      <span className="text-sm text-gray-600">{asset.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-lg text-blue-800 mb-3">Benefícios Esperados</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <span className="text-green-800 font-medium">Economia Tributária</span>
                <p className="text-xl font-bold mt-1">{financialDetails.benefits.taxSavings}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-blue-800 font-medium">Economia em Sucessão</span>
                <p className="text-xl font-bold mt-1">{financialDetails.benefits.successionReduction}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <span className="text-purple-800 font-medium">Proteção Patrimonial</span>
                <p className="text-xl font-bold mt-1">{financialDetails.benefits.liabilityProtection}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <span className="text-amber-800 font-medium">Retorno do Investimento</span>
                <p className="text-xl font-bold mt-1">{financialDetails.benefits.roi}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="structure">Estrutura</TabsTrigger>
          <TabsTrigger value="costs">Custos e Benefícios</TabsTrigger>
          <TabsTrigger value="documents">Documentos para Assinatura</TabsTrigger>
        </TabsList>
        
        {/* Structure Tab */}
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento da Estrutura Societária</CardTitle>
              <CardDescription>
                Visualização completa da estrutura proposta para sua holding familiar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* We'd use a more sophisticated visualization here in a real app */}
              <div className="border rounded-md p-4 bg-gray-50 min-h-40 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  [Aqui será exibido um diagrama visual da estrutura societária proposta]
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-3">Características da Estrutura</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Holding Patrimonial Pura</span>
                      <p className="text-sm text-gray-600">Dedicada exclusivamente à gestão de bens e participações societárias</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Sociedade Limitada</span>
                      <p className="text-sm text-gray-600">Formato escolhido para maximizar benefícios fiscais e facilitar gestão</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Administração Compartilhada</span>
                      <p className="text-sm text-gray-600">Com governança clara definida no acordo de sócios</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Cláusulas Específicas de Proteção</span>
                      <p className="text-sm text-gray-600">Blindagem contra riscos de terceiros e entre sócios</p>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Costs Tab */}
        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Custos e Benefícios Detalhados</CardTitle>
              <CardDescription>
                Análise completa de custos de implementação, manutenção e benefícios esperados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-lg mb-4">Custos de Implementação</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between border-b pb-2">
                      <span>Honorários Jurídicos</span>
                      <span className="font-medium">{financialDetails.setup.legal}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Taxas de Registro e Cartório</span>
                      <span className="font-medium">{financialDetails.setup.registration}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Consultoria Especializada</span>
                      <span className="font-medium">{financialDetails.setup.consulting}</span>
                    </div>
                    <div className="flex justify-between pt-2 font-bold">
                      <span>Total de Implementação</span>
                      <span>{financialDetails.setup.total}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-4">Custos Anuais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span>Contabilidade</span>
                      <span className="font-medium">{financialDetails.annual.accounting}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Tributos Recorrentes</span>
                      <span className="font-medium">{financialDetails.annual.taxes}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Manutenção e Compliance</span>
                      <span className="font-medium">{financialDetails.annual.maintenance}</span>
                    </div>
                    <div className="flex justify-between pt-2 font-bold">
                      <span>Total Anual</span>
                      <span>{financialDetails.annual.total}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Benefícios Projetados</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Economia Tributária Anual</span>
                        <span className="font-bold text-green-600">{financialDetails.benefits.taxSavings}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Redução significativa em tributos sobre rendimentos de aluguéis, ganhos de capital, e outros rendimentos dos ativos incorporados.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Economia em Processos Sucessórios</span>
                        <span className="font-bold text-green-600">{financialDetails.benefits.successionReduction}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Valor estimado economizado em impostos e custos relacionados à transmissão de herança.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Proteção Patrimonial</span>
                        <span className="font-bold text-blue-600">{financialDetails.benefits.liabilityProtection}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Blindagem efetiva contra riscos empresariais, proteção contra processos e credores.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Tempo de Retorno de Investimento</span>
                        <span className="font-bold text-amber-600">{financialDetails.benefits.roi}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Período estimado para que os benefícios financeiros superem os custos de implementação.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800">Análise de Viabilidade</h4>
                    <p className="mt-1 text-sm">
                      Com base nos valores estimados, a criação da holding familiar representa uma 
                      <strong className="text-green-700"> excelente relação custo-benefício</strong>, 
                      com retorno total do investimento previsto em menos de 2 anos, 
                      além dos benefícios não-financeiros de proteção patrimonial e planejamento sucessório.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos para Assinatura</CardTitle>
              <CardDescription>
                Assine eletronicamente todos os documentos necessários para implementação da holding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{doc.name}</h3>
                        {doc.required && (
                          <span className="ml-2 text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="mr-1 h-4 w-4" />
                        Visualizar
                      </Button>
                      {doc.status === 'signed' ? (
                        <Button variant="outline" size="sm" disabled className="text-green-600 border-green-200">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Assinado
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleSignDocument(doc.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Assinar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {adjustmentRequested ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-orange-800 mb-2">Solicitação de Ajustes Enviada</h3>
                  <p className="text-sm text-orange-700">
                    Seu consultor foi notificado e entrará em contato para discutir os ajustes solicitados.
                  </p>
                </div>
              ) : showAdjustmentForm ? (
                <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                  <h3 className="font-medium mb-2">Descreva os ajustes necessários:</h3>
                  <textarea 
                    className="w-full border rounded-md p-3 min-h-24 mb-4" 
                    placeholder="Detalhe os pontos que precisam ser ajustados na proposta..."
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAdjustmentForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleRequestAdjustment}
                    >
                      Enviar Solicitação
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Action buttons */}
      <div className="mt-8 flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => setShowAdjustmentForm(true)}
          disabled={adjustmentRequested}
          className="border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          {adjustmentRequested ? (
            <>Ajustes Solicitados</>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Solicitar Ajustes
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleApprovePlan}
          disabled={!canApprove || adjustmentRequested}
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {canApprove ? (
            <>
              Aprovar Plano e Continuar
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>Assine todos os documentos obrigatórios</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlanApproval;
