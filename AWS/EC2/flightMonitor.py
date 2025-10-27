import boto3
from dotenv import load_dotenv
import os
import parseData
import saveToDB
import json

load_dotenv("secret.env")

sqs = boto3.client('sqs', region_name='us-east-1')

queue_url = os.getenv("SQS_URL")

def fetch_messages(queue_url, max_messages, wait_time):
    response = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=max_messages,
        WaitTimeSeconds=wait_time
    )
    return response.get('Messages', [])

def process_messages(messages):
    queueurl = queue_url
    for message in messages:
        body_dict = json.loads(message['Body'])

        itineraries = body_dict['data']['itineraries']

        data = parseData.processGoogleFlightsData(itineraries)

        for intin in data:

            saveToDB.insertDB(intin)
        sqs.delete_message(
            QueueUrl=queueurl,
            ReceiptHandle=message['ReceiptHandle']
        )

def main():
    while True:
        messages = fetch_messages(queue_url, 10, 10)
        if messages:
            process_messages(messages)
        else:
            print("No messages, waiting...")

if __name__ == "__main__":
    main()