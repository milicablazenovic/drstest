export interface User {
    id: string;
    name: string;
    lastname: string;
    address: string;
    city: string;
    country: string;
    phone_num: string;
    email: string;
    password: string;
}

export interface Transaction {
    id: number;
    name: string;
    symbol: string;
    type: number;
    amount: number;
    time_transacted: string;
    time_created: string;
    price_purchased_at: number;
    no_of_coins: number;
}