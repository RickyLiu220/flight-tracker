# Flight Data Platform
A full-stack application that collects, processes, and displays flight data with user authentication.
## Motivation
Continuously tracking flights for reasonable prices is a difficult and time-consuming task. This platform collects live flight information, processes it efficiently, and provides users with an easy-to-use interface to monitor flights
## Features
- Collect flight data use AWS Lambda and Google Flights API
- Process and store data into PostgreSQL with EC2
- Fetch data via Spring Boot backend APIs
- User Authentication with Google SSO and Firebase
- Interactive React w/ Tailwind CSS frontend
## Tech Stack
- Data Pipeline / Backend Infrastructure:
  - AWS Lambda
  - AWS SQS
  - AWS EC2
  - AWS RDS
  - AWS SES
- Backend:
  - Spring Boot
  - Java
- Frontend:
  - React
  - TypeScript
- Authentication
  - Firebase
  - Google Single Sign-On (SSO)
- APIs / Integration:
  - Google Flights API
## Project Structure

