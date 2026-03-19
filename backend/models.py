from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, CheckConstraint
from database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("username = LOWER(username)", name="username_lowercase"),
    )

    user_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)

class Word(Base):
    __tablename__ = "words"

    word_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    word_arabic: Mapped[str] = mapped_column(nullable=False)
    word_hebrew: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str | None] = mapped_column(nullable=True)