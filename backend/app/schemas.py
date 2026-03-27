from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, field_validator


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Category / PaymentMethod ──────────────────────────────────────────────────

class CategoryOut(BaseModel):
    id: int
    name: str
    type: str

    model_config = {"from_attributes": True}


class PaymentMethodOut(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


# ── Expense ───────────────────────────────────────────────────────────────────

class ExpenseCreate(BaseModel):
    amount: Decimal
    category_id: int
    payment_method_id: int
    type: Literal["expense", "income"] = "expense"
    currency: Literal["GHS", "USD", "RWF"] = "USD"
    transaction_date: date
    description: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Amount must be greater than zero")
        return v


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = None
    category_id: Optional[int] = None
    payment_method_id: Optional[int] = None
    type: Optional[Literal["expense", "income"]] = None
    currency: Optional[Literal["GHS", "USD", "RWF"]] = None
    transaction_date: Optional[date] = None
    description: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Amount must be greater than zero")
        return v


class ExpenseOut(BaseModel):
    expense_id: int
    user_id: int
    amount: Decimal
    category_id: int
    payment_method_id: int
    type: str
    currency: str
    transaction_date: date
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    category: CategoryOut
    payment_method: PaymentMethodOut

    model_config = {"from_attributes": True}
