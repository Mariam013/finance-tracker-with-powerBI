from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import hash_password


# ── Users ─────────────────────────────────────────────────────────────────────

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, data: schemas.UserCreate) -> models.User:
    user = models.User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ── Categories ────────────────────────────────────────────────────────────────

def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).order_by(models.Category.name).all()


# ── Payment Methods ───────────────────────────────────────────────────────────

def get_payment_methods(db: Session) -> List[models.PaymentMethod]:
    return db.query(models.PaymentMethod).order_by(models.PaymentMethod.name).all()


# ── Expenses ──────────────────────────────────────────────────────────────────

def get_expenses(db: Session, user_id: int) -> List[models.Expense]:
    return (
        db.query(models.Expense)
        .filter(models.Expense.user_id == user_id)
        .order_by(models.Expense.transaction_date.desc(), models.Expense.created_at.desc())
        .all()
    )


def get_expense(db: Session, expense_id: int, user_id: int) -> Optional[models.Expense]:
    return (
        db.query(models.Expense)
        .filter(models.Expense.expense_id == expense_id, models.Expense.user_id == user_id)
        .first()
    )


def create_expense(db: Session, data: schemas.ExpenseCreate, user_id: int) -> models.Expense:
    expense = models.Expense(
        user_id=user_id,
        amount=data.amount,
        category_id=data.category_id,
        payment_method_id=data.payment_method_id,
        type=data.type,
        currency=data.currency,
        transaction_date=data.transaction_date,
        description=data.description,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def update_expense(db: Session, expense: models.Expense, data: schemas.ExpenseUpdate) -> models.Expense:
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense: models.Expense) -> None:
    db.delete(expense)
    db.commit()
