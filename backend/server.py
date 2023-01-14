import requests

from flask import Flask, request, jsonify, session
from collections import defaultdict
from datetime import datetime, timedelta
from psycopg2 import pool
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt, check_password_hash



from logic import format_db_row_to_transaction, User
from logic import BOUGHT, SOLD

#coin gecko za live cenu crypto
LIVE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price"  

app = Flask(__name__)


app.secret_key = "super secret key"
app.config['POSTGRESQL_DATABASE_URI'] = "postgres://docker:docker@database:5432/drsdb"

cors = CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

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

def delete_validation(id):
    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    statement = f"SELECT * FROM transaction WHERE id = {id} AND user_id = {session['user_id']} "
    cur.execute(statement)
    data = cur.fetchone()
    return data

def create_user():
    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS \"user\" (name VARCHAR (20) NOT NULL, lastname VARCHAR (20) NOT NULL, address VARCHAR (30) NOT NULL, city VARCHAR (20) NOT NULL, country VARCHAR (20) NOT NULL, phone_num VARCHAR (10) NOT NULL, email VARCHAR (20) NOT NULL, password VARCHAR (500) NOT NULL, user_id serial PRIMARY KEY)")
    conn.commit()

def create_transaction():
    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS transaction (id serial PRIMARY KEY, name VARCHAR (12) NOT NULL, symbol VARCHAR (5) NOT NULL, type SMALLINT NOT NULL, amount INT NOT NULL, time_transacted TIMESTAMP NOT NULL, time_created TIMESTAMP NOT NULL, price_purchased_at NUMERIC NOT NULL, no_of_coins NUMERIC NULL, user_id INT NOT NULL)")
    conn.commit()

create_transaction()
create_user()

@app.route("/hello")
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

    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    if not validate_user(email):
        insert_statement = f"INSERT INTO \"user\" (name, lastname, address, city, country, phone_num, email, password) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *"
        cur.execute(insert_statement, (name, lastname, address, city, country, phone_num, email, password))
        conn.commit()
        return jsonify({'result': result}) 

        # User vec postoji
    return jsonify({'error':'User already exists'}), 409
       

@app.route("/edit_user", methods=['POST'])
def edit_user():

    if session.get('user_id') is None:
        return jsonify({'resdult':'You are logged out'}), 401

    name = request.json["name"]
    lastname = request.json["lastname"]
    address = request.json["address"]
    city = request.json["city"]
    country = request.json["country"]
    phone_num = request.json["phone_num"]
    email = request.json["email"]
    password = bcrypt.generate_password_hash(request.json["password"]).decode('utf-8')

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

    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    insert_statement = f"UPDATE \"user\" SET name = %s, lastname = %s, address = %s, city = %s, country = %s, phone_num = %s, email = %s, password = %s WHERE user_id = {session['user_id']}"
    cur.execute(insert_statement, (name, lastname, address, city, country, phone_num, email, password))
    conn.commit()
    return jsonify(result)


@app.route("/login", methods=['POST'])
def login():

    email = request.json["email"]
    password = request.json["password"]
    result = ""

    if not validate_user(email):
        return jsonify({'error':'Unauthorized'}), 401

    conn = postgreSQL_pool.getconn()  
    cur = conn.cursor()

    statement = f"SELECT * FROM \"user\" WHERE email = %s"
    cur.execute(statement, (email,))
    row = cur.fetchone()

    
    if bcrypt.check_password_hash(row[7], password):
        session['user_id'] = row[8]
        """access_token = create_access_token(
            identity={'name': row[0], 'lastname': row[1], 'email': row[6]})"""
        result = jsonify({'email': email, 
                          'id': row[8]})
    else:
        result = jsonify({"error": "Unauthorized"}), 401

    return result


@app.route('/logout', methods=['POST'])
def logout():
    session.pop("user_id", None)
    return jsonify({'result':'You are logged out'}), 200
  

@app.route("/add_transaction", methods=["POST"])
def new_transaction():

    if session.get('user_id') is None:
        return jsonify({'resdult':'You are logged out'}), 401

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

    insert_statement = f"INSERT INTO transaction (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, {session['user_id']}) RETURNING *"
    cur.execute(insert_statement, (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins))
    conn.commit()

    return jsonify(request.json)

@app.route("/get_all_transactions", methods=["GET"])
def get_transactions():

    if session.get('user_id') is None:
        return jsonify({'resdult':'You are logged out'}), 401

    user_id = session['user_id']

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    cur.execute(f"SELECT * FROM transaction WHERE user_id = %s", (user_id,))
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

    if session.get('user_id') is None:
        return jsonify({'resdult':'You are logged out'}), 401

    portfolio = defaultdict(
        # inicijalno vrednosti su 0
        lambda: {                   
            "coins": 0,
            "total_cost": 0,
            "total_equity": 0,
            "live_price": 0,
            "total_gain_loss": 0
        }
    )

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    # za svaku crypto valutu izvucemo koliko je ukupno placeno za nju i koliko ukupno coina imamo
    # i grupisemo po tome da li je prodaja ili kupovina
    cur.execute(f"SELECT symbol, type, SUM(amount)/100 AS total_amount, SUM(no_of_coins) AS total_coins FROM transaction WHERE user_id = {session['user_id']} GROUP BY symbol, type")
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
        portfolio[symbol]['total_equity'] = float(
            float(portfolio[symbol]['coins']) * live_price
        )

        # ukupni gain/loss po valuti
        # ukupna trenutna vrednost - ukupno para potroseno
        total_gain_loss = 0
        total_gain_loss += (portfolio[symbol]['total_equity'] - portfolio[symbol]['total_cost']) 

        portfolio[symbol]['total_gain_loss'] = total_gain_loss

        response_list.append(
            {
                "symbol": symbol,
                "live_price": portfolio[symbol]['live_price'],
                "total_equity": portfolio[symbol]['total_equity'],
                "coins": portfolio[symbol]['coins'],
                "total_cost": portfolio[symbol]['total_cost'],
                "total_gain_loss": portfolio[symbol]['total_gain_loss']
            }
        )

    return jsonify(response_list)


@app.route("/delete_transaction", methods=["DELETE"])
def delete_transaction():

    if session.get('user_id') is None:
        return jsonify({'resdult':'You are logged out'}), 401

    id = request.json["id"]

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    if not delete_validation(id):

        cur.execute(f"DELETE FROM transaction WHERE id = %s AND user_id = {session['user_id']}", (id,))
        conn.commit()
        return jsonify({'result': 'transaction deleted'})  , 200

    return jsonify({'error': 'transaction does not exist' }), 404


app.run(debug=True, port=5000)