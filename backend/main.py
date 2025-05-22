import os
from utils.config import OPENAI_API_KEY

# Verificar se a chave da API está configurada
if not OPENAI_API_KEY:
    print("\n⚠️  ATENÇÃO: Chave da API OpenAI não encontrada!")
    print("Por favor, configure sua chave da API OpenAI no arquivo .env")
    print("Você pode copiar o arquivo .env.example para .env e adicionar sua chave.")
    print("Exemplo: OPENAI_API_KEY=sk-sua_chave_aqui\n")
    
    # Criar arquivo .env se não existir
    if not os.path.exists(os.path.join(os.path.dirname(__file__), '.env')):
        with open(os.path.join(os.path.dirname(__file__), '.env'), 'w') as f:
            f.write("OPENAI_API_KEY=\n")
        print("Um arquivo .env foi criado. Adicione sua chave da API e execute novamente.")
    
    exit(1)

# Importações principais
import asyncio
from cli.terminal_chat import run_chat_session

if __name__ == "__main__":
    print("\n🏢 Iniciando Chat Onboarding para Consultoria Patrimonial...\n")
    print("Este sistema conduzirá uma conversa para coletar informações sobre seu perfil patrimonial.")
    print("As informações coletadas serão utilizadas para preparar sua reunião com consultores especializados.")
    print("Responda às perguntas de forma natural. O sistema extrairá as informações relevantes automaticamente.\n")
    print("Pressione Enter para começar...\n")
    input()
    
    try:
        asyncio.run(run_chat_session())
    except KeyboardInterrupt:
        print("\n\nSessão encerrada pelo usuário. Obrigado por utilizar nosso sistema!")
    except Exception as e:
        print(f"\n\nOcorreu um erro durante a execução: {str(e)}")
        print("Por favor, verifique sua conexão com a internet e a configuração da API OpenAI.")
