from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)


class Word(Base):
    __tablename__ = "words"

    word_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    word_arabic: Mapped[str] = mapped_column(nullable=False)
    word_hebrew: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str | None] = mapped_column(nullable=True)


class SubList(Base):
    __tablename__ = "sub_lists"

    sublist_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)


class SubListWord(Base):
    __tablename__ = "sublist_words"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sublist_id: Mapped[int] = mapped_column(ForeignKey("sub_lists.sublist_id"), nullable=False)
    word_id: Mapped[int] = mapped_column(ForeignKey("words.word_id"), nullable=False)