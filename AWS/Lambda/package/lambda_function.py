import boto3
import json
import requests
import os
from datetime import date

QUrl = os.environ.get("QUEUE_URL")
apiKey = os.environ.get("RAPIDAPI_KEY")

def send_to_sqs(message):
    sqs = boto3.client('sqs', region_name='us-east-1')
    message_str = json.dumps(message)
    response = sqs.send_message(QueueUrl=QUrl, MessageBody=message_str)
    print("Sent message ID:", response.get('MessageId'))
    return response

def api_call(departure, arrival, outbound, apiKey, host):
    url = "https://google-flights2.p.rapidapi.com/api/v1/searchFlights"
    querystring = {
        "departure_id": departure,
        "arrival_id": arrival,
        "travel_class": "ECONOMY",
        "adults": "1",
        "show_hidden": "1",
        "currency": "USD",
        "language_code": "en-US",
        "country_code": "US",
        "search_type": "best",
        "outbound_date": outbound
    }
    headers = {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey
    }
    response = requests.get(url, headers=headers, params=querystring)
    response.raise_for_status()
    return response.json()

def lambda_handler(event, context):
    today = date.today().strftime("%Y-%m-%d")
    host = "google-flights2.p.rapidapi.com"
    try:
        flights = api_call("LAX", "JFK", today, apiKey, host)
        send_to_sqs(flights)
        return {"statusCode": 200, "body": "Flights data sent to SQS"}
    except Exception as e:
        print("Error:", e)
        return {"statusCode": 500, "body": str(e)}

if __name__ == "__main__":
    print(lambda_handler({}, None))

