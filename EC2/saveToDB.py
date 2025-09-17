import psycopg2
import json
from dotenv import load_dotenv
import os

load_dotenv("secret.env")

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = int(os.getenv("DB_PORT"))

def insertDB(data):
    """
    Inserts all given values as a tuple into the database

    Parameters:
    flight_number (string): A string that represents the flight number
    airline (string): The airlines name. e.g Delta
    departure_time (timestamp): when the plane took off
    arrival_time (timestamp): when the plane landed
    origin (string): departure airport code
    destination (string): arrival airport code
    price (float): the price of one economy ticket on this flight

    Returns:
    Nothing
    """
    conn = pyscopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )

    print(data[0])


    flight_data = (flight_number, airline, departure_time, arrival_time, origin, destination, price)

    cursor = conn.cursor()
    insert_query = """
    insert into FlightData (flight_number, airline, departure_time, arrival_time, origin, destination, price) 
    values (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(insert_query, flights_data)
    conn.commit()
    cursor.close()
    conn.close()
    return True