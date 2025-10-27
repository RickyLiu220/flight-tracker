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
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )
    curr = data
    print(curr)
    if str(curr[0][0][0]).lower() == "unavailable":
        return
    flight_data = (curr[0][0][0], curr[0][0][1], curr[0][0][2])
    cursor = conn.cursor()
    insert_query = """
    insert into itineraries (price, origin, destination)
    values (%s, %s, %s)
    returning itinerary_id
    """
    cursor.execute(insert_query, flight_data)
    itinerary_id = cursor.fetchone()[0]
    insert_flight = """
    INSERT INTO flights (itinerary_id, flight_number, airline, departure_time, >
    values (%s, %s, %s, %s, %s, %s, %s)
    """
    for f in curr[1]:
        flight_number, airline, dept_time, arrival_time, f_origin, f_dest = f[0]
        cursor.execute(insert_flight, (
            itinerary_id, flight_number, airline, dept_time, arrival_time, f_or>
        ))
    conn.commit()
    cursor.close()
    conn.close()
    return True