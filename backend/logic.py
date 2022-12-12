
from datetime import datetime
from dataclasses import dataclass
import datetime

#type, oznacava da li kupujemo ili prodajemo crypto
BOUGHT = 1   
SOLD = 0

@dataclass(frozen=True)
class Transaction:
    id: int
    name: str
    symbol: str
    type: int
    amount: int
    time_transacted: datetime
    time_created: datetime
    price_purchased_at: float
    no_of_coins: float

@dataclass(frozen=True)
class User:
    name: str
    lastname: str
    address: str
    city: str
    country: str
    phone_num: str
    email: str
    password: str

def format_db_row_to_transaction(row):
    return Transaction(
        id=row[0],
        name=row[1],
        symbol=row[2],
        type=row[3],
        #cena je inicijalno u centima, zato delimo sa 100
        amount=row[4]/100, 
        time_transacted=row[5].strftime("%Y/%m/%d"),
        time_created=row[6].strftime("%Y/%m/%d"),
        price_purchased_at=float(row[7]),
        no_of_coins=float(row[8])
    )