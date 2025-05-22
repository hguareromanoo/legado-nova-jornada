from database.manager import SupabaseManager
from services.session_service import SessionService
from services.profile_service import ProfileService

async def test_basic_operations():
    db = SupabaseManager()
    await db.initialize()
    
    profile_service = ProfileService(db)
    session_service = SessionService(db, profile_service)
    
    # Criar uma sessão
    session = await session_service.create_session()
    print(f"Sessão criada: {session.session_id}")
    
    # Adicionar uma mensagem
    message = await session_service.add_message(
        session_id=session.session_id,
        role="user",
        content="Olá, meu nome é João e tenho 45 anos."
    )
    print(f"Mensagem adicionada: {message.message_id}")

import asyncio
asyncio.run(test_basic_operations())
