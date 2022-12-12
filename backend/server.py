import requests

from flask import Flask, request, jsonify
from collections import defaultdict
from datetime import datetime
from psycopg2 import pool
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager

from logic import format_db_row_to_transaction
from logic import BOUGHT, SOLD

#coin gecko za live cenu crypto
LIVE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price"  

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'my_only_secret'

cors = CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

symbol_to_coin_map = {
    "BTC": "bitcoin",
    "SOL": "solana",
    "LINK": "chainlink",
    "ETH": "ethereum",
    "ADA": "cardano",
    "MANA": "decentraland",
    "DOGE": "dogecoin",
    "LTC": "litecoin",
    "DOT": "polkadot",
}


# pool za komunikaciju baze sa flask app
postgreSQL_pool = pool.SimpleConnectionPool(
    1, 1000,
    database="drsdb",
    user="docker",
    password="docker",
    host="127.0.0.1"
)

app.config['postgreSQL_pool'] = postgreSQL_pool

def validate_user(email):
    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    statement = f"SELECT * FROM \"user\" WHERE email = '{email}'"
    cur.execute(statement)
    data = cur.fetchone()
    return data



@app.route("/")
def health_check():
    return "I am healthy!"



@app.route("/register", methods=['POST'])
def new_user():
    name = request.json["name"]
    lastname = request.json["lastname"]
    address = request.json["address"]
    city = request.json["city"]
    country = request.json["country"]
    phone_num = request.json["phone_num"]
    email = request.json["email"]
    password = bcrypt.generate_password_hash(request.json["password"]).decode('utf-8')

    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    if not validate_user(email):
        insert_statement = f"INSERT INTO \"user\" (name, lastname, address, city, country, phone_num, email, password) VALUES ('{name}', '{lastname}', '{address}', '{city}', '{country}', '{phone_num}', '{email}', '{password}') RETURNING *"
        cur.execute(insert_statement)
        conn.commit()

        result = {
            'name': name,
            'lastname': lastname,
            'address': address,
            'city': city,
            'country': country,
            'phone_num': phone_num,
            'email': email,
            'password': password
        }

        return jsonify({'result': result})
    else:

        # User vec postoji
        result = jsonify({'result': 1})
        return result

@app.route("/login", methods=['POST'])
def login():
    email = request.json["email"]
    password = request.json["password"]
    result = ""

    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    statement = f"SELECT * FROM \"user\" WHERE email = '{email}'"
    cur.execute(statement)
    row = cur.fetchone()

    
    if bcrypt.check_password_hash(row[7], password):
        access_token = create_access_token(
            identity={'name': row[0], 'lastname': row[1], 'email': row[6]})
        result = jsonify({"access_token" : access_token})
    else:
        result = jsonify({"error": "Invalid email and password"})

    return result


@app.route("/transactions", methods=["POST"])
def new_transaction():

    symbol = request.json["symbol"]

    response = requests.get(
        f"{LIVE_PRICE_URL}?ids={symbol_to_coin_map[symbol]}&vs_currencies=usd"
    ).json()

    name = request.json["name"]
    type = request.json["type"]
    amount = request.json["amount"]
    time_transacted = datetime.fromtimestamp(request.json["time_transacted"])
    time_created = datetime.fromtimestamp(request.json["time_created"])
    price_purchased_at = float(response[symbol_to_coin_map[symbol]]['usd'])
    no_of_coins = (amount/100) / price_purchased_at
    
    # konektujemo se na bazu podataka
    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    insert_statement = f"INSERT INTO transaction (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins) VALUES ('{name}', '{symbol}', {type}, {amount}, '{time_transacted}', '{time_created}', {price_purchased_at}, {no_of_coins}) RETURNING *"
    cur.execute(insert_statement)
    conn.commit()

    return jsonify(request.json)

@app.route("/transactions", methods=["GET"])
@cross_origin()
def get_transactions():
    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM transaction")
    # pokupimo sve redove iz baze
    rows = cur.fetchall()  

    return jsonify(
        [
            format_db_row_to_transaction(row)  
            for row in rows

        ]
    )


@app.route("/get_portfolio", methods=["GET"])
def get_portfolio():
    portfolio = defaultdict(
        # inicijalno vrednosti su 0
        lambda: {                   
            "coins": 0,
            "total_cost": 0,
            "total_equity": 0,
            "live_price": 0
        }
    )

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    # za svaku crypto valutu izvucemo koliko je ukupno placeno za nju i koliko ukupno coina imamo
    # i grupisemo po tome da li je prodaja ili kupovina
    cur.execute("SELECT symbol, type, SUM(amount)/100 AS total_amount, SUM(no_of_coins) AS total_coins FROM transaction GROUP BY symbol, type")
    rows = cur.fetchall()


    for row in rows:
        coin = row[0]
        transaction_type = row[1]
        transaction_amount = row[2]
        transaction_coins = row[3]

        # ovde sabiramo / oduzimamo na nivou celog portfolia
        # kupovina
        if transaction_type == BOUGHT:
            portfolio[coin]['total_cost'] += transaction_amount
            portfolio[coin]['coins'] += transaction_coins
        else:
            # prodaja
            portfolio[coin]['total_cost'] -= transaction_amount
            portfolio[coin]['coins'] -= transaction_coins

    response_list = []


    for symbol in portfolio:
        # za svaku valutu izvucemo trenutnu cenu
        response = requests.get(
            f"{LIVE_PRICE_URL}?ids={symbol_to_coin_map[symbol]}&vs_currencies=usd"
        ).json()
        live_price = response[symbol_to_coin_map[symbol]]['usd']
        
        portfolio[symbol]['live_price'] = live_price

        # ukupna trenutna vrednost po valuti
        # u bazi imamo cenu valute kada je kupljena
        # na osnovu toga mozemo dobiti koliki je gain/loss
        # tako sto cemo od total equity oduzeti total cost (naravno sabrati ove dve stavke za ceo portfolio)

        portfolio[symbol]['total_equity'] = float(
            float(portfolio[symbol]['coins']) * live_price
        )

        response_list.append(
            {
                "symbol": symbol,
                "live_price": portfolio[symbol]['live_price'],
                "total_equity": portfolio[symbol]['total_equity'],
                "coins": portfolio[symbol]['coins'],
                "total_cost": portfolio[symbol]['total_cost']
            }
        )

    return jsonify(response_list)




app.run(debug=True, port=5000)