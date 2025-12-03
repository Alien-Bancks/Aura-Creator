from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# 1. Define o nome do arquivo do banco (vai aparecer na pasta raiz)
SQLALCHEMY_DATABASE_URL = "sqlite:///./aura_history.db"

# 2. Cria o motor de conexão
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 3. Define a Tabela "History"
class HistoryItem(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.now)
    platform = Column(String)      # Ex: Instagram
    task_type = Column(String)     # Ex: Legenda
    image_path = Column(String)    # Caminho da foto
    result_text = Column(Text)     # O texto gerado

# 4. Função auxiliar para pegar o banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()