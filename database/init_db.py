# database/init_db.py
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Precisamos da service_key para alterações no schema

def init_db():
    """Initialize the database schema in Supabase."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables")
    
    # Headers for Supabase API
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    # SQL statements to execute - combinando tudo em um único SQL statement
    sql_statements = ["""
    -- Primeiro, limpar tabelas existentes se houver (em ordem reversa para respeitar as FKs)
    DROP TABLE IF EXISTS conversation_messages;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS document_recommendations;
    DROP TABLE IF EXISTS concerns;
    DROP TABLE IF EXISTS goals;
    DROP TABLE IF EXISTS assets;
    DROP TABLE IF EXISTS family_members;
    DROP TABLE IF EXISTS personal_info;
    DROP TABLE IF EXISTS client_profiles;
    
    -- Depois, dropar os tipos personalizados
    DROP TYPE IF EXISTS goal_type;
    DROP TYPE IF EXISTS asset_type; 
    DROP TYPE IF EXISTS marital_status_type;
    
    -- Criar tipos personalizados (enums)
    CREATE TYPE marital_status_type AS ENUM (
        'solteiro', 'casado', 'divorciado', 'viúvo', 'união estável', 'outro'
    );
    
    CREATE TYPE asset_type AS ENUM (
        'imóvel', 'empresa', 'investimento financeiro', 'propriedade rural', 'outro'
    );
    
    CREATE TYPE goal_type AS ENUM (
        'sucessão familiar', 'otimização fiscal', 'proteção patrimonial', 'governança familiar', 'outro'
    );
    
    -- Tabela de perfis de cliente
    CREATE TABLE client_profiles (
        profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completion_score_personal FLOAT NOT NULL DEFAULT 0,
        completion_score_family FLOAT NOT NULL DEFAULT 0,
        completion_score_assets FLOAT NOT NULL DEFAULT 0,
        completion_score_goals FLOAT NOT NULL DEFAULT 0,
        completion_score_overall FLOAT NOT NULL DEFAULT 0,
        notes TEXT
    );
    
    -- Tabela de informações pessoais
    CREATE TABLE personal_info (
        personal_info_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        name TEXT,
        age INTEGER,
        marital_status marital_status_type,
        profession TEXT,
        CONSTRAINT unique_profile_personal_info UNIQUE (profile_id)
    );
    
    -- Tabela de membros da família
    CREATE TABLE family_members (
        member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        relation TEXT NOT NULL,
        name TEXT,
        age INTEGER,
        is_dependent BOOLEAN DEFAULT FALSE
    );
    
    -- Tabela de ativos/patrimônios
    CREATE TABLE assets (
        asset_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        asset_type asset_type NOT NULL,
        description TEXT NOT NULL,
        estimated_value NUMERIC,
        location TEXT,
        ownership TEXT,
        notes TEXT
    );
    
    -- Tabela de objetivos
    CREATE TABLE goals (
        goal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        goal_type goal_type NOT NULL,
        description TEXT NOT NULL,
        priority INTEGER
    );
    
    -- Tabela de preocupações
    CREATE TABLE concerns (
        concern_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        priority INTEGER
    );
    
    -- Tabela de recomendações de documentos
    CREATE TABLE document_recommendations (
        recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        reason TEXT,
        is_mandatory BOOLEAN DEFAULT TRUE
    );
    
    -- Tabela de sessões de conversa
    CREATE TABLE sessions (
        session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        profile_id UUID NOT NULL REFERENCES client_profiles(profile_id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        is_complete BOOLEAN NOT NULL DEFAULT FALSE,
        completion_percentage FLOAT NOT NULL DEFAULT 0,
        current_step TEXT DEFAULT 'welcome',
        last_page TEXT
    );
    
    -- Tabela de mensagens de conversa
    CREATE TABLE conversation_messages (
        message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        extracted_entities JSONB
    );
    
    -- Índices para otimização
    CREATE INDEX idx_profiles_user_id ON client_profiles(user_id);
    CREATE INDEX idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX idx_sessions_profile_id ON sessions(profile_id);
    CREATE INDEX idx_sessions_active ON sessions(is_active);
    CREATE INDEX idx_messages_session_id ON conversation_messages(session_id);
    CREATE INDEX idx_messages_timestamp ON conversation_messages(timestamp);
    CREATE INDEX idx_family_members_profile ON family_members(profile_id);
    CREATE INDEX idx_assets_profile ON assets(profile_id);
    CREATE INDEX idx_goals_profile ON goals(profile_id);
    CREATE INDEX idx_concerns_profile ON concerns(profile_id);
    CREATE INDEX idx_document_recommendations_profile ON document_recommendations(profile_id);
    """]
    
    # Execute each SQL statement
    print("Iniciando criação do esquema do banco de dados...")
    
    for sql in sql_statements:
        print(f"Executando SQL:\n{sql[:100]}...")  # Exibe apenas os primeiros 100 caracteres
        
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/execute_sql",
            headers=headers,
            json={"query": sql}
        )
        
        if response.status_code != 200:
            print(f"Erro executando SQL!")
            print(f"Status code: {response.status_code}")
            print(f"Resposta: {response.text}")
            return False
        
        print("SQL executado com sucesso!")
    
    print("Esquema do banco de dados criado com sucesso!")
    return True

if __name__ == "__main__":
    init_db()