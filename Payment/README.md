# Payment Project

## Description
This project is a Java web application that provides a payment processing service. It uses a servlet to handle payment requests and stores payment information in a SQLite database. This project is intended to be used with a separate frontend application.

## How to Run
1.  Make sure you have Java and Maven installed.
2.  Navigate to the `Payment` directory.
3.  Build the project using Maven: `mvn clean install`
4.  Deploy the generated WAR file (located in the `target` directory) to a servlet container such as Tomcat.
5.  The payment service will be available at `http://localhost:8082/Payment/PaymentServlet`.

## Details
-   The application uses a servlet for handling payment requests.
-   It uses a SQLite database to store payment information.
-   The servlet is located at `/PaymentServlet`.
-   It sets CORS headers to allow requests from `http://localhost:3000`.
-   This project is intended to be used with a separate frontend application.
