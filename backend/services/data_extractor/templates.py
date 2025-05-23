from typing import Dict

prompts_dict: Dict[str, str] = {
    "rg": """Você está lidando com um RG (Registro Geral). Extraia os seguintes dados exatamente como aparecem no documento:
- Número do RG
- Órgão emissor
- Estado emissor (UF)
- Data de emissão (se existir)

Não adicione nenhuma informação que não esteja presente no documento.""",

    "cpf": """Você está lidando com um CPF (Cadastro de Pessoa Física). Extraia apenas o número do CPF exatamente como aparece no documento. Não adicione nenhum dado adicional.""",

    "certidao_nascimento": """Você está lidando com uma certidão de nascimento. Extraia:
- Nome completo
- Data de nascimento
- Nome do cartório
- Livro, folha e termo (se presentes)

Não inclua comentários ou interpretações.""",

    "certidao_casamento": """Você está lidando com uma certidão de casamento. Extraia:
- Nome do cônjuge
- Data do casamento
- Nome do cartório
- Regime de bens (exatamente como está no documento)

Todos os campos devem refletir o conteúdo literal da certidão.""",

    "pacto_antenupcial": """Você está lidando com um pacto antenupcial. Extraia:
- Livro e folha (se estiverem presentes)
- Cartório onde foi registrado
- Data do pacto

Preencha apenas se os dados estiverem explicitamente no texto.""",

    "certidao_regime_bens": """Você está lidando com uma certidão de regime de bens. Extraia:
- Regime de bens (exatamente como descrito)
- Nome do cartório
- Data da certidão

Se algum campo não existir, retorne como nulo.""",

    "procuracao": """Você está lidando com uma procuração pública. Extraia:
- Nome do outorgante
- Nome do outorgado
- Finalidade da procuração
- Nome do cartório
- Data de emissão

Não preencha nada que não esteja no documento.""",

    "matricula_imovel": """Você está lidando com uma matrícula de imóvel. Extraia:
- Número da matrícula
- Cartório de registro
- Endereço completo
- CEP, cidade e estado
- Nome de todos os proprietários
- Descrição do imóvel
- Área total (se houver)

Não resuma nem altere as descrições. Copie como estão.""",

    "certidao_onus_reais": """Você está lidando com uma certidão de ônus reais. Extraia:
- Número da matrícula
- Nome do cartório
- Indicação se possui ônus (True ou False)
- Detalhes do ônus, se existirem

Todos os dados devem estar presentes no documento.""",

    "certidao_negativa_iptu": """Você está lidando com uma certidão negativa de IPTU. Extraia:
- Número de inscrição do imóvel
- Município
- Indicação se há débitos
- Data de emissão, se presente

Não adicione inferências.""",

    "contrato_doacao_imovel": """Você está lidando com um contrato de doação ou integralização de imóvel. Extraia:
- Nome do doador
- Nome do donatário
- Nome ou descrição do imóvel
- Tipo de documento (escritura pública ou instrumento particular)
- Nome do cartório (se houver)
- Data do contrato

Todos os dados devem estar explícitos.""",

    "laudo_avaliacao_imovel": """Você está lidando com um laudo de avaliação de imóvel. Extraia:
- Nome ou identificação do imóvel
- Valor avaliado
- Nome do profissional responsável
- Registro profissional (CREA, CAU)
- Data do laudo

Copie exatamente como estiver no texto.""",

    "crlv": """Você está lidando com um CRLV (Certificado de Registro e Licenciamento de Veículo). Extraia:
- Placa
- RENAVAM
- Chassi
- Proprietário
- Marca e modelo
- Ano de fabricação
- UF de registro

Não adicione ou modifique dados.""",

    "certidao_negativa_veiculo": """Você está lidando com uma certidão negativa de débitos de veículo. Extraia:
- Placa do veículo
- Indicação se há débitos (True ou False)
- Detalhes dos débitos (se houver)

Use apenas o conteúdo literal do documento.""",

    "contrato_social": """Você está lidando com um contrato social de empresa. Extraia:
- Nome da empresa
- CNPJ
- Número do NIRE (se existir)
- Junta comercial (se estiver presente)
- Lista de sócios
- Participação de cada sócio (como percentual ou descrição)

Use os nomes e números exatamente como aparecem.""",

    "titularidade_cotas": """Você está lidando com um documento que comprova titularidade de cotas/ações. Extraia:
- Nome da empresa
- CNPJ
- Nome do titular
- Percentual ou quantidade de cotas
- Documento de comprovação (se existir)

Se algo estiver ausente, retorne como nulo.""",

    "extrato_investimentos": """Você está lidando com um extrato consolidado de investimentos. Extraia:
- Instituição financeira
- Saldo total
- Tipos de investimento listados
- Data do extrato (se estiver presente)

Use o valor e texto como aparecem.""",

    "conta_bancaria": """Você está lidando com um comprovante de conta bancária. Extraia:
- Nome do banco
- Número da agência
- Número da conta
- Tipo da conta (corrente, poupança, investimento)
- Nome do titular

Preencha apenas com dados explícitos.""",

    "declaracao_bens": """Você está lidando com uma declaração de bens. Extraia:
- Lista de bens descritos
- Valor total estimado (se houver)
- Data da declaração (se constar)

Não invente ou interprete categorias.""",

    "testamento": """Você está lidando com um testamento. Extraia:
- Nome do outorgante
- Nome do cartório
- Data do testamento
- Qualquer detalhe relevante da disposição patrimonial (resumo literal)

Copie o conteúdo principal fielmente.""",

    "definicao_capital_social": """Você está lidando com um documento de definição de capital social. Extraia:
- Valor total do capital social
- Forma de integralização (ex.: bens, dinheiro, imóveis)
- Lista de sócios
- Percentual de cada sócio

Não altere os nomes ou valores.""",

    "documento_contador": """Você está lidando com um documento do contador responsável. Extraia:
- Nome do contador
- Número do CRC
- E-mail (se houver)
- Telefone (se houver)

Todos os dados devem estar visíveis no documento.""",
}