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
    Inserts a parsed itinerary and its associated flights into the database.

    Each itinerary stores a list of flight IDs. If a flight already exists
    (same flight_number, departure_time, arrival_time, origin, destination),
    we reuse its ID instead of creating a duplicate.

    Parameters:
    data (list): A structured list in the following format:
        [
            [[price, origin, destination]],   # itinerary-level data
            [
                [(flight_number, airline, departure_time, arrival_time, origin, destination)],
                ...
            ]
        ]
    """

    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )
    cursor = conn.cursor()

    curr = data
    print(curr)

    # Skip unavailable results
    if str(curr[0][0][0]).lower() == "unavailable":
        return

    # Extract itinerary-level info
    price, origin, destination = curr[0][0]
    flight_ids = []  # holds all associated flight IDs

    # SQL queries
    select_flight_query = """
        SELECT flight_id
        FROM flights
        WHERE flight_number = %s
          AND departure_time = %s
          AND arrival_time = %s
          AND origin = %s
          AND destination = %s
    """

    insert_flight_query = """
        INSERT INTO flights (flight_number, airline, departure_time, arrival_time, origin, destination)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING flight_id
    """

    insert_itinerary_query = """
        INSERT INTO itineraries (price, origin, destination, flight_ids)
        VALUES (%s, %s, %s, %s)
        RETURNING itinerary_id
    """

    # Loop through flights and populate flight_ids list
    for f in curr[1]:
        flight_number, airline, dept_time, arrival_time, f_origin, f_dest = f[0]

        # Check if flight already exists
        cursor.execute(select_flight_query, (flight_number, dept_time, arrival_time, f_origin, f_dest))
        result = cursor.fetchone()

        if result:
            flight_id = result[0]
            print(f"Found existing flight {flight_number}, ID={flight_id}")
        else:
            # Insert new flight and return its id
            cursor.execute(insert_flight_query, (flight_number, airline, dept_time, arrival_time, f_origin, f_dest))
            flight_id = cursor.fetchone()[0]
            print(f"Inserted new flight {flight_number}, ID={flight_id}")

        flight_ids.append(flight_id)

    # Insert itinerary with collected flight_ids
    cursor.execute(insert_itinerary_query, (price, origin, destination, flight_ids))
    itinerary_id = cursor.fetchone()[0]
    print(f"Inserted itinerary ID={itinerary_id} with flights {flight_ids}")

    conn.commit()
    cursor.close()
    conn.close()

    return True
