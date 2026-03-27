"""
Run once to populate categories and payment methods:
    python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine
from app.models import Base, Category, PaymentMethod

Base.metadata.create_all(bind=engine)

CATEGORIES = ["Food", "Transport", "Utilities", "Rent", "Shopping", "Entertainment", "Health", "Savings", "Other"]
PAYMENT_METHODS = ["Cash", "Mobile Money", "Bank Transfer", "Card"]


def seed():
    db = SessionLocal()
    try:
        for name in CATEGORIES:
            if not db.query(Category).filter_by(name=name).first():
                db.add(Category(name=name))

        for name in PAYMENT_METHODS:
            if not db.query(PaymentMethod).filter_by(name=name).first():
                db.add(PaymentMethod(name=name))

        db.commit()
        print("Seeded categories and payment methods.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
