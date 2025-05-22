from uuid import UUID
from typing import Dict, List, Any, Optional
from models.pydantic_models import (
    ClientProfile, CompletionScore, DocumentRecommendation,
    PersonalInfo, FamilyMember, Asset, Goal, Concern,
    MaritalStatus, AssetType, GoalType, DocumentCategory
)
from agents.extraction import ExtractionOutput
from database.repositories.profile_repository import ProfileRepository
from database.repositories.personal_info_repository import PersonalInfoRepository
from database.repositories.family_repository import FamilyRepository
from database.repositories.asset_repository import AssetRepository
from database.repositories.goal_repository import GoalRepository
from database.repositories.concern_repository import ConcernRepository
from database.repositories.document_repository import DocumentRepository
from database.manager import SupabaseManager
from datetime import datetime
import logging

# Configurar logging
logger = logging.getLogger("service.profile")

class ProfileService:
    """
    Serviço para gerenciamento de perfis de cliente.
    Implementa lógica de negócio relacionada a perfis e entidades relacionadas.
    """
    
    def __init__(self, db_manager: SupabaseManager):
        """
        Inicializa o serviço de perfis.
        
        Args:
            db_manager: Gerenciador de conexão com o banco de dados
        """
        self.db = db_manager
        self.profile_repo = ProfileRepository(db_manager)
        self.personal_info_repo = PersonalInfoRepository(db_manager)
        self.family_repo = FamilyRepository(db_manager)
        self.asset_repo = AssetRepository(db_manager)
        self.goal_repo = GoalRepository(db_manager)
        self.concern_repo = ConcernRepository(db_manager)
        self.document_repo = DocumentRepository(db_manager)
    
    async def create_profile(self, user_id: Optional[UUID] = None) -> ClientProfile:
        """
        Cria um novo perfil para um usuário.
        
        Args:
            user_id: ID do usuário (opcional)
            
        Returns:
            Perfil criado
        """
        try:
            logger.info(f"Criando novo perfil para usuário {user_id}")
            
            # Cria perfil
            profile_id = await self.profile_repo.create_profile(user_id)
            
            # Cria informações pessoais vazias
            await self.personal_info_repo.create_personal_info(profile_id)
            
            # Retorna perfil completo
            return await self.get_complete_profile(profile_id)
        except Exception as e:
            logger.error(f"Erro ao criar perfil: {str(e)}")
            raise
    
    async def get_complete_profile(self, profile_id: UUID) -> ClientProfile:
        """
        Obtém um perfil completo com todas as entidades relacionadas.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Perfil completo
            
        Raises:
            ValueError: Se o perfil não for encontrado
        """
        try:
            logger.info(f"Buscando perfil completo: {profile_id}")
            
            # Obtém dados do perfil
            profile_data = await self.profile_repo.get_profile(profile_id)
            if not profile_data:
                logger.error(f"Perfil {profile_id} não encontrado")
                raise ValueError(f"Perfil {profile_id} não encontrado")
            
            # Obtém informações pessoais
            personal_info_data = await self.personal_info_repo.get_personal_info(profile_id)
            
            # Obtém membros da família
            family_members_data = await self.family_repo.get_family_members(profile_id)
            
            # Obtém ativos
            assets_data = await self.asset_repo.get_assets(profile_id)
            
            # Obtém objetivos
            goals_data = await self.goal_repo.get_goals(profile_id)
            
            # Obtém preocupações
            concerns_data = await self.concern_repo.get_concerns(profile_id)
            
            # Obtém recomendações de documentos
            document_recommendations_data = await self.document_repo.get_document_recommendations(profile_id)
            
            # Constrói PersonalInfo
            personal_info = PersonalInfo(
                name=personal_info_data.get("name") if personal_info_data else None,
                age=personal_info_data.get("age") if personal_info_data else None,
                marital_status=MaritalStatus(personal_info_data.get("marital_status")) if personal_info_data and personal_info_data.get("marital_status") else None,
                profession=personal_info_data.get("profession") if personal_info_data else None
            )
            
            # Constrói FamilyMembers
            family_members = []
            for member_data in family_members_data:
                family_members.append(FamilyMember(
                    relation=member_data.get("relation"),
                    name=member_data.get("name"),
                    age=member_data.get("age"),
                    is_dependent=member_data.get("is_dependent")
                ))
            
            # Constrói Assets
            assets = []
            for asset_data in assets_data:
                assets.append(Asset(
                    asset_type=AssetType(asset_data.get("asset_type")),
                    description=asset_data.get("description"),
                    estimated_value=asset_data.get("estimated_value"),
                    location=asset_data.get("location"),
                    ownership=asset_data.get("ownership"),
                    notes=asset_data.get("notes")
                ))
            
            # Constrói Goals
            goals = []
            for goal_data in goals_data:
                goals.append(Goal(
                    goal_type=GoalType(goal_data.get("goal_type")),
                    description=goal_data.get("description"),
                    priority=goal_data.get("priority")
                ))
            
            # Constrói Concerns
            concerns = []
            for concern_data in concerns_data:
                concerns.append(Concern(
                    description=concern_data.get("description"),
                    priority=concern_data.get("priority")
                ))
            
            # Constrói DocumentRecommendations
            document_recommendations = []
            for doc_data in document_recommendations_data:
                document_recommendations.append(DocumentRecommendation(
                name=doc_data.get("name"),
                document_key=doc_data.get("document_key"),
                category=doc_data.get("category"),
                description=doc_data.get("description"),
                reason=doc_data.get("reason"),
                is_mandatory=doc_data.get("is_mandatory", True),
                priority=doc_data.get("priority", 1),
                related_to=doc_data.get("related_to"),
                item_type=doc_data.get("item_type"),
                item_description=doc_data.get("item_description"),
                item_index=doc_data.get("item_index"),
                how_to_obtain=doc_data.get("how_to_obtain"),
                estimated_cost=doc_data.get("estimated_cost"),
                processing_time=doc_data.get("processing_time"),
                group_id=doc_data.get("group_id")
            ))
            
            # Constrói CompletionScore
            completion_score = CompletionScore(
                personal=profile_data.get("completion_score_personal", 0),
                family=profile_data.get("completion_score_family", 0),
                assets=profile_data.get("completion_score_assets", 0),
                goals=profile_data.get("completion_score_goals", 0),
                overall=profile_data.get("completion_score_overall", 0)
            )
            
            # Constrói perfil completo
            return ClientProfile(
                profile_id=UUID(profile_data.get("profile_id")),
                created_at=datetime.fromisoformat(profile_data.get("created_at")) if profile_data.get("created_at") else datetime.now(),
                updated_at=datetime.fromisoformat(profile_data.get("updated_at")) if profile_data.get("updated_at") else datetime.now(),
                personal_info=personal_info,
                family_members=family_members,
                assets=assets,
                goals=goals,
                concerns=concerns,
                completion_score=completion_score,
                document_recommendations=document_recommendations,
                notes=profile_data.get("notes")
            )
        except ValueError as e:
            # Repassa exceções de valor
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar perfil completo {profile_id}: {str(e)}")
            raise
    
    async def update_profile(self, profile_id: UUID, extraction_output: ExtractionOutput) -> ClientProfile:
        """
        Atualiza um perfil com informações extraídas.
        
        Args:
            profile_id: ID do perfil
            extraction_output: Saída da extração
            
        Returns:
            Perfil atualizado
        """
        try:
            logger.info(f"Atualizando perfil {profile_id} com informações extraídas")
            
            # Atualiza informações pessoais
            if extraction_output.personal_info_updates:
                updates = {}
                for key, value in extraction_output.personal_info_updates.model_dump().items():
                    if value is not None:
                        updates[key] = value
                if updates:
                    logger.info(f"Atualizando informações pessoais: {updates}")
                    await self.personal_info_repo.update_personal_info(profile_id, updates)
            
            # Adiciona membros da família
            if extraction_output.family_members_updates:
                logger.info(f"Adicionando {len(extraction_output.family_members_updates)} membros da família")
                for member in extraction_output.family_members_updates:
                    await self.family_repo.add_family_member(profile_id, member.model_dump())
            
            # Adiciona ativos
            if extraction_output.assets_updates:
                logger.info(f"Adicionando {len(extraction_output.assets_updates)} ativos")
                for asset in extraction_output.assets_updates:
                    await self.asset_repo.add_asset(profile_id, asset.model_dump())
            
            # Adiciona objetivos
            if extraction_output.goals_updates:
                logger.info(f"Adicionando {len(extraction_output.goals_updates)} objetivos")
                for goal in extraction_output.goals_updates:
                    await self.goal_repo.add_goal(profile_id, goal.model_dump())
            
            # Adiciona preocupações
            if extraction_output.concerns_updates:
                logger.info(f"Adicionando {len(extraction_output.concerns_updates)} preocupações")
                for concern in extraction_output.concerns_updates:
                    await self.concern_repo.add_concern(profile_id, concern.model_dump())
            
            # Calcula pontuação de completude
            completion_score = await self.calculate_completion_score(profile_id)
            
            # Atualiza perfil com novas pontuações
            logger.info(f"Atualizando pontuações de completude: {completion_score.overall:.2f}")
            await self.profile_repo.update_completion_scores(profile_id, {
                "personal": completion_score.personal,
                "family": completion_score.family,
                "assets": completion_score.assets,
                "goals": completion_score.goals,
                "overall": completion_score.overall
            })
            
            # Verifica se o perfil está completo o suficiente para gerar recomendações de documentos
            if extraction_output.is_complete:
                logger.info("Gerando recomendações de documentos")
                # Gera recomendações de documentos
                document_recommendations = await self.recommend_documents(profile_id)
                
                # Limpa recomendações existentes
                await self.document_repo.clear_document_recommendations(profile_id)
                
                # Adiciona novas recomendações
                for doc in document_recommendations:
                    await self.document_repo.add_document_recommendation(profile_id, doc.model_dump())
            
            # Retorna perfil atualizado
            return await self.get_complete_profile(profile_id)
        except Exception as e:
            logger.error(f"Erro ao atualizar perfil {profile_id}: {str(e)}")
            raise
    
    async def calculate_completion_score(self, profile_id: UUID) -> CompletionScore:
        """
        Calcula a pontuação de completude para um perfil.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Pontuação de completude
        """
        try:
            # Obtém perfil
            profile = await self.get_complete_profile(profile_id)
            
            score = CompletionScore()
            
            # Calcula completude de informações pessoais
            personal_fields = 0
            personal_filled = 0
            for field in ["name", "age", "marital_status", "profession"]:
                personal_fields += 1
                if getattr(profile.personal_info, field) is not None:
                    personal_filled += 1
            
            score.personal = personal_filled / personal_fields if personal_fields > 0 else 0.0
            
            # Calcula completude de família
            score.family = min(1.0, len(profile.family_members) / 3) if profile.personal_info.marital_status else 0.0
            
            # Calcula completude de ativos
            score.assets = min(1.0, len(profile.assets) / 5)
            
            # Calcula completude de objetivos
            score.goals = min(1.0, len(profile.goals) / 3)
            
            # Calcula completude geral
            score.overall = (score.personal + score.family + score.assets + score.goals) / 4
            
            return score
        except Exception as e:
            logger.error(f"Erro ao calcular pontuação de completude para perfil {profile_id}: {str(e)}")
            raise
    
    async def recommend_documents(self, profile_id: UUID) -> List[DocumentRecommendation]:
        """
        Recomenda APENAS documentos obrigatórios com chaves simples para OCR.
        
        Args:
            profile_id: ID do perfil
            
        Returns:
            Lista de recomendações de documentos OBRIGATÓRIOS com chaves únicas
        """
        try:
            profile = await self.get_complete_profile(profile_id)
            recommendations = []
            
            # ==========================================
            # 1. DOCUMENTOS PESSOAIS OBRIGATÓRIOS
            # ==========================================
            
            recommendations.extend([
                DocumentRecommendation(
                    name="RG (Registro Geral)",
                    document_key="rg",
                    category=DocumentCategory.PERSONAL,
                    description="Documento de identidade oficial",
                    reason="Obrigatório para todos os sócios",
                    is_mandatory=True,
                    priority=5,
                    how_to_obtain="Emitido pelo órgão de identificação estadual",
                    processing_time="Imediato (se já possui)",
                    group_id="001_documentos_pessoais"
                ),
                DocumentRecommendation(
                    name="CPF (Cadastro de Pessoa Física)",
                    document_key="cpf",
                    category=DocumentCategory.PERSONAL,
                    description="Documento da Receita Federal para identificação fiscal",
                    reason="Obrigatório para todos os sócios",
                    is_mandatory=True,
                    priority=5,
                    how_to_obtain="Já emitido pela Receita Federal",
                    processing_time="Imediato",
                    group_id="001_documentos_pessoais"
                ),
                DocumentRecommendation(
                    name="Comprovante de residência",
                    document_key="comprovante_residencia",
                    category=DocumentCategory.PERSONAL,
                    description="Conta de consumo recente (água, luz, internet, etc.)",
                    reason="Obrigatório para todos os sócios",
                    is_mandatory=True,
                    priority=4,
                    how_to_obtain="Última conta de água, luz ou telefone em seu nome",
                    processing_time="Imediato",
                    group_id="001_documentos_pessoais"
                )
            ])
            
            # ==========================================
            # 2. DOCUMENTOS BASEADOS NO ESTADO CIVIL
            # ==========================================
            
            if profile.personal_info.marital_status == MaritalStatus.SINGLE:
                recommendations.append(
                    DocumentRecommendation(
                        name="Certidão de nascimento",
                        document_key="certidao_nascimento",
                        category=DocumentCategory.PERSONAL,
                        description="Para sócios solteiros",
                        reason="Comprova estado civil de solteiro",
                        is_mandatory=True,
                        priority=4,
                        how_to_obtain="Cartório de registro civil onde foi registrado",
                        processing_time="1-3 dias úteis",
                        group_id="001_documentos_pessoais"
                    )
                )
            
            elif profile.personal_info.marital_status == MaritalStatus.MARRIED:
                recommendations.extend([
                    DocumentRecommendation(
                        name="Certidão de casamento",
                        document_key="certidao_casamento",
                        category=DocumentCategory.FAMILY,
                        description="Para sócios casados",
                        reason="Necessário para verificar o regime de bens",
                        is_mandatory=True,
                        priority=5,
                        how_to_obtain="Cartório onde foi realizado o casamento",
                        processing_time="1-3 dias úteis",
                        group_id="002_documentos_familiares"
                    ),
                    DocumentRecommendation(
                        name="Certidão de regime de bens atualizada",
                        document_key="certidao_regime_bens",
                        category=DocumentCategory.FAMILY,
                        description="Especifica o regime de bens do casamento",
                        reason="Essencial para estruturação da holding familiar",
                        is_mandatory=True,
                        priority=5,
                        how_to_obtain="Cartório de registro civil onde foi feito o casamento",
                        processing_time="1-3 dias úteis",
                        group_id="002_documentos_familiares"
                    )
                ])
            
            elif profile.personal_info.marital_status == MaritalStatus.STABLE_UNION:
                recommendations.append(
                    DocumentRecommendation(
                        name="Contrato de União Estável",
                        document_key="contrato_uniao_estavel",
                        category=DocumentCategory.FAMILY,
                        description="Formalização da união estável",
                        reason="Necessário para verificar o regime de bens e formalização da união",
                        is_mandatory=True,
                        priority=5,
                        how_to_obtain="Cartório de notas (escritura pública)",
                        processing_time="3-5 dias úteis",
                        group_id="002_documentos_familiares"
                    )
                )
            
            elif profile.personal_info.marital_status in [MaritalStatus.DIVORCED, MaritalStatus.WIDOWED]:
                recommendations.append(
                    DocumentRecommendation(
                        name="Certidão de divórcio/óbito",
                        document_key="certidao_divorcio_obito",
                        category=DocumentCategory.FAMILY,
                        description="Comprova mudança do estado civil",
                        reason="Necessário para comprovar estado civil atual",
                        is_mandatory=True,
                        priority=4,
                        how_to_obtain="Cartório onde foi registrado o divórcio/óbito",
                        processing_time="1-3 dias úteis",
                        group_id="002_documentos_familiares"
                    )
                )
            
            # ==========================================
            # 3. DOCUMENTOS DOS HERDEIROS (NUMERADOS)
            # ==========================================
            
            filho_count = 0
            for member in profile.family_members:
                if member.relation.lower() in ['filho', 'filha', 'herdeiro']:
                    filho_count += 1
                    member_name = member.name or f"{member.relation} {filho_count}"
                    
                    recommendations.append(
                        DocumentRecommendation(
                            name=f"Certidão de nascimento - {member_name}",
                            document_key=f"certidao_nascimento_filho_{filho_count}",
                            category=DocumentCategory.FAMILY,
                            description=f"Certidão de nascimento do(a) {member.relation}",
                            reason="Necessário para planejamento sucessório",
                            is_mandatory=True,
                            priority=4,
                            related_to=member.name or f"{member.relation}_{member.age}",
                            item_type="family_member",
                            item_description=f"{member.relation} - {member_name}",
                            item_index=filho_count,
                            how_to_obtain="Cartório de registro civil onde foi registrado",
                            processing_time="1-3 dias úteis",
                            group_id="002_documentos_familiares"
                        )
                    )
            
            # ==========================================
            # 4. DOCUMENTOS DE IMÓVEIS (NUMERADOS)
            # ==========================================
            
            real_estate_assets = [asset for asset in profile.assets if asset.asset_type == AssetType.REAL_ESTATE]
            for i, asset in enumerate(real_estate_assets, 1):
                asset_identifier = f"imovel_{i}"
                asset_description = f"{asset.description} - {asset.location or 'Local não informado'}"
                
                recommendations.extend([
                    DocumentRecommendation(
                        name=f"Matrícula atualizada - Imóvel {i}",
                        document_key=f"matricula_imovel_{i}",
                        category=DocumentCategory.REAL_ESTATE,
                        description=f"Matrícula do imóvel: {asset.description}",
                        reason="Documento que comprova a titularidade do imóvel",
                        is_mandatory=True,
                        priority=5,
                        related_to=asset_identifier,
                        item_type="real_estate",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="Cartório de registro de imóveis competente",
                        processing_time="1-2 dias úteis",
                        estimated_cost="R$ 15-30",
                        group_id="003_documentos_imoveis"
                    ),
                    DocumentRecommendation(
                        name=f"Certidão de ônus reais - Imóvel {i}",
                        document_key=f"certidao_onus_reais_{i}",
                        category=DocumentCategory.REAL_ESTATE,
                        description=f"Certidão de ônus do imóvel: {asset.description}",
                        reason="Verifica se o imóvel tem dívidas, hipotecas ou penhoras",
                        is_mandatory=True,
                        priority=4,
                        related_to=asset_identifier,
                        item_type="real_estate",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="Mesmo cartório da matrícula",
                        processing_time="1-2 dias úteis",
                        estimated_cost="R$ 15-25",
                        group_id="003_documentos_imoveis"
                    ),
                    DocumentRecommendation(
                        name=f"Certidão negativa IPTU - Imóvel {i}",
                        document_key=f"certidao_iptu_{i}",
                        category=DocumentCategory.TAX,
                        description=f"Certidão de débitos municipais do imóvel: {asset.description}",
                        reason="Comprova ausência de débitos de IPTU",
                        is_mandatory=True,
                        priority=4,
                        related_to=asset_identifier,
                        item_type="real_estate",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="Site da prefeitura municipal",
                        processing_time="Imediato (online)",
                        estimated_cost="Gratuito",
                        group_id="006_documentos_tributarios"
                    )
                ])
            
            # ==========================================
            # 5. DOCUMENTOS DE PROPRIEDADES RURAIS (NUMERADOS)
            # ==========================================
            
            rural_assets = [asset for asset in profile.assets if asset.asset_type == AssetType.RURAL]
            for i, asset in enumerate(rural_assets, 1):
                asset_identifier = f"rural_{i}"
                asset_description = f"{asset.description} - {asset.location or 'Local não informado'}"
                
                recommendations.append(
                    DocumentRecommendation(
                        name=f"CCIR - Propriedade Rural {i}",
                        document_key=f"ccir_{i}",
                        category=DocumentCategory.REAL_ESTATE,
                        description=f"Certificado de Cadastro de Imóvel Rural: {asset.description}",
                        reason="Documento obrigatório para propriedades rurais",
                        is_mandatory=True,
                        priority=5,
                        related_to=asset_identifier,
                        item_type="rural_property",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="INCRA (Instituto Nacional de Colonização e Reforma Agrária)",
                        processing_time="5-10 dias úteis",
                        group_id="003_documentos_imoveis"
                    )
                )
            
            # ==========================================
            # 6. DOCUMENTOS DE EMPRESAS (NUMERADOS)
            # ==========================================
            
            company_assets = [asset for asset in profile.assets if asset.asset_type == AssetType.COMPANY]
            for i, asset in enumerate(company_assets, 1):
                asset_identifier = f"empresa_{i}"
                asset_description = f"{asset.description}"
                
                recommendations.extend([
                    DocumentRecommendation(
                        name=f"Contrato social - Empresa {i}",
                        document_key=f"contrato_social_{i}",
                        category=DocumentCategory.COMPANY,
                        description=f"Contrato social da empresa: {asset.description}",
                        reason="Necessário para análise da estrutura societária",
                        is_mandatory=True,
                        priority=5,
                        related_to=asset_identifier,
                        item_type="company",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="Junta Comercial ou contador da empresa",
                        processing_time="1-3 dias úteis",
                        group_id="004_documentos_empresas"
                    ),
                    DocumentRecommendation(
                        name=f"Balanço patrimonial - Empresa {i}",
                        document_key=f"balanco_patrimonial_{i}",
                        category=DocumentCategory.COMPANY,
                        description=f"Demonstrações financeiras: {asset.description}",
                        reason="Para avaliação financeira da empresa",
                        is_mandatory=True,
                        priority=4,
                        related_to=asset_identifier,
                        item_type="company",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="Contador da empresa",
                        processing_time="3-7 dias úteis",
                        group_id="004_documentos_empresas"
                    ),
                    DocumentRecommendation(
                        name=f"Prova de titularidade - Empresa {i}",
                        document_key=f"prova_titularidade_cotas_{i}",
                        category=DocumentCategory.COMPANY,
                        description=f"Participação societária: {asset.description}",
                        reason="Comprova propriedade das cotas/ações",
                        is_mandatory=True,
                        priority=4,
                        related_to=asset_identifier,
                        item_type="company",
                        item_description=asset_description,
                        item_index=i,
                        how_to_obtain="Última alteração contratual ou certificado de ações",
                        processing_time="1-3 dias úteis",
                        group_id="004_documentos_empresas"
                    )
                ])
            
            # ==========================================
            # 7. DOCUMENTOS FINANCEIROS
            # ==========================================
            
            financial_assets = [asset for asset in profile.assets if asset.asset_type == AssetType.FINANCIAL]
            if financial_assets:
                recommendations.append(
                    DocumentRecommendation(
                        name="Extrato consolidado de investimentos",
                        document_key="extrato_investimentos",
                        category=DocumentCategory.FINANCIAL,
                        description="Relatório de todos os investimentos financeiros",
                        reason="Para declarar bens mobiliários na holding",
                        is_mandatory=True,
                        priority=3,
                        how_to_obtain="Corretoras, bancos ou plataforma de investimentos",
                        processing_time="Imediato (online)",
                        group_id="005_documentos_financeiros"
                    )
                )
            
            # ==========================================
            # 8. DOCUMENTOS BASEADOS EM OBJETIVOS
            # ==========================================
            
            # Sucessão familiar - Declaração de bens obrigatória
            has_succession_goal = any(goal.goal_type == GoalType.SUCCESSION for goal in profile.goals)
            if has_succession_goal or len(profile.family_members) > 0:
                recommendations.append(
                    DocumentRecommendation(
                        name="Declaração de bens dos sócios",
                        document_key="declaracao_bens",
                        category=DocumentCategory.LEGAL,
                        description="Inventário completo do patrimônio familiar",
                        reason="Essencial para planejamento sucessório",
                        is_mandatory=True,
                        priority=4,
                        how_to_obtain="Elaborado com apoio do contador",
                        processing_time="5-10 dias úteis",
                        group_id="007_documentos_juridicos"
                    )
                )
            
            # Otimização fiscal - IR obrigatório para análise
            has_tax_goal = any(goal.goal_type == GoalType.TAX for goal in profile.goals)
            if has_tax_goal:
                recommendations.append(
                    DocumentRecommendation(
                        name="Declaração de Imposto de Renda (últimos 3 anos)",
                        document_key="declaracao_ir",
                        category=DocumentCategory.TAX,
                        description="DIRPF dos últimos 3 exercícios",
                        reason="Para análise fiscal e tributária detalhada",
                        is_mandatory=True,
                        priority=4,
                        how_to_obtain="Portal e-CAC da Receita Federal",
                        processing_time="Imediato (download)",
                        group_id="006_documentos_tributarios"
                    )
                )
            
            # ==========================================
            # 9. DOCUMENTOS TÉCNICOS OBRIGATÓRIOS
            # ==========================================
            
            recommendations.append(
                DocumentRecommendation(
                    name="Dados do contador responsável",
                    document_key="dados_contador",
                    category=DocumentCategory.LEGAL,
                    description="CRC e dados de contato do contador",
                    reason="Para assinar o contrato social e escrituração",
                    is_mandatory=True,
                    priority=5,
                    how_to_obtain="Contador escolhido para a holding",
                    processing_time="Imediato",
                    group_id="007_documentos_juridicos"
                )
            )
            
            # ==========================================
            # 10. ORGANIZAÇÃO FINAL
            # ==========================================
            
            # Ordenar por prioridade (maior primeiro) e depois por categoria
            recommendations.sort(key=lambda x: (-x.priority, x.category.value, x.name))
            
            logger.info(f"Geradas {len(recommendations)} recomendações de documentos OBRIGATÓRIOS para perfil {profile_id}")
            return recommendations
            
        except Exception as e:
            logger.error(f"Erro ao recomendar documentos para perfil {profile_id}: {str(e)}")
            raise