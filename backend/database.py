from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Database URL - SQLite for development, MySQL/PostgreSQL for production
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./localix.db"
)

# For MySQL in production:
# DATABASE_URL = "mysql+pymysql://user:password@localhost/localix"

# For PostgreSQL in production:
# DATABASE_URL = "postgresql://user:password@localhost/localix"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
