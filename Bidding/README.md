# Bidding Project

## Description
This project is a Java web application that provides backend services for a bidding system. It uses servlets and WebSockets to manage auctions and bids. This project is intended to be used with a separate frontend application.

## How to Run
1.  Make sure you have Java and Maven installed.
2.  Navigate to the `Bidding` directory.
3.  Build the project using Maven: `mvn clean install`
4.  Deploy the generated WAR file (located in the `target` directory) to a servlet container such as Tomcat.
5.  The backend services will be available at `http://localhost:8081/Bidding/`.

## Details
-   The application uses servlets for handling bidding requests.
-   It uses WebSockets for real-time updates.
-   The main servlet is located at `/bidding`.
-   This project is intended to be used with a separate frontend application.
