def processGoogleFlightsData(raw):
    """
    This method parses the json sent by Google Flights API.

    Parameters:
    raw (json): the JSON returned by the API

    Returns:
    The data parsed from the API that is ready for insertion into the database
    """
    top_flights = raw['topFlights']
    other_flights = raw['otherFlights']
    ret = []

    # This is for the top flights
    for i in range(len(top_flights)):
        # For the itinerary, we need intin_id, price, origin, and destination
        this_itin = []
        itinerary = top_flights[i]

        dept = itinerary['flights'][0]['departure_airport']['airport_code']

        arr = itinerary['flights'][len(itinerary['flights']) - 1]['arrival_airport']['airport_code']

        price = itinerary['price']
        this_itin.append([price, dept, arr])

        subflights = []

        # For all subflights, we need flight_number, airline, dept_time, arrival_time, origin, dest

        for j in range(len(itinerary['flights'])):
            this_flight = []
            flight = itinerary['flights'][j]

            flight_number = flight['flight_number']
            airline = flight['airline']
            dept_time = flight['departure_airport']['time']
            arrival_time = flight['arrival_airport']['time']
            origin = flight['departure_airport']['airport_code']
            dest = flight['arrival_airport']['airport_code']
            this_flight.append([flight_number, airline, dept_time, arrival_time, origin, dest])
            subflights.append(this_flight)
        #append a list of [this itinerary, [flight1, flight2, ...]]
        ret.append([this_itin, subflights])

    # This is for the other flights
    for i in range(len(other_flights)):
        # For the itinerary, we need intin_id, price, origin, and destination
        this_itin = []
        itinerary = other_flights[i]

        dept = itinerary['flights'][0]['departure_airport']['airport_code']

        arr = itinerary['flights'][len(itinerary['flights']) - 1]['arrival_airport']['airport_code']

        price = itinerary['price']
        this_itin.append([price, dept, arr])

        subflights = []

        # For all subflights, we need flight_number, airline, dept_time, arrival_time, origin, dest

        for j in range(len(itinerary['flights'])):
            this_flight = []
            flight = itinerary['flights'][j]

            flight_number = flight['flight_number']
            airline = flight['airline']
            dept_time = flight['departure_airport']['time']
            arrival_time = flight['arrival_airport']['time']
            origin = flight['departure_airport']['airport_code']
            dest = flight['arrival_airport']['airport_code']
            this_flight.append([flight_number, airline, dept_time, arrival_time, origin, dest])
            subflights.append(this_flight)
        #append a list of [this itinerary, [flight1, flight2, ...]]
        ret.append([this_itin, subflights])
    return ret