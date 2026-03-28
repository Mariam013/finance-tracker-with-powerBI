import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas, models
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(tags=["expenses"])


@router.get("/categories/", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)


@router.get("/payment-methods/", response_model=List[schemas.PaymentMethodOut])
def list_payment_methods(db: Session = Depends(get_db)):
    return crud.get_payment_methods(db)


@router.get("/expenses/", response_model=List[schemas.ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_expenses(db, current_user.id)


@router.post("/expenses/", response_model=schemas.ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    data: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_expense(db, data, current_user.id)


@router.put("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(
    expense_id: int,
    data: schemas.ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    expense = crud.get_expense(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return crud.update_expense(db, expense, data)


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    expense = crud.get_expense(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    crud.delete_expense(db, expense)


@router.get("/export/transactions")
def export_transactions(
    api_key: str = Query(...),
    db: Session = Depends(get_db),
):
    expected = os.getenv("EXPORT_API_KEY")
    if not expected or api_key != expected:
        raise HTTPException(status_code=403, detail="Invalid API key")

    expenses = db.query(models.Expense).all()
    return [
        {
            "id": e.expense_id,
            "user_id": e.user_id,
            "type": e.type,
            "amount": float(e.amount),
            "currency": e.currency,
            "category": e.category.name,
            "payment_method": e.payment_method.name,
            "date": str(e.transaction_date),
            "description": e.description or "",
            "created_at": str(e.created_at),
        }
        for e in expenses
    ]
