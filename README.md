# 🐾 Welcome to MeowMart! 🐾

This project is an e-commerce bidding site where users can bid on cats, purchase all kinds of cats, and then checkout and have them delivered! 😻 It consists of several components: an authentication service, a bidding service, a payment service, and a web frontend.

## Authentication Project 😼

### Description
This project is a Java web application that demonstrates user authentication using servlets and WebSockets. It allows users to log in and interact with a WebSocket endpoint.

### How to Run
1.  Make sure you have Java and Maven installed.
2.  Navigate to the `Authentication` directory.
3.  Build the project using Maven: `mvn clean install`
4.  Deploy the generated WAR file (located in the `target` directory) to a servlet container such as Tomcat.
5.  Access the application through your browser at `http://localhost:8080/Authentication/`.
6.  You can interact with the WebSocket endpoint using the `WebSocketClient.html` file.

## Bidding Project 😹

### Description
This project is a Java web application that provides backend services for a bidding system. It uses servlets and WebSockets to manage auctions and bids. This project is intended to be used with a separate frontend application.

### How to Run
1.  Make sure you have Java and Maven installed.
2.  Navigate to the `Bidding` directory.
3.  Build the project using Maven: `mvn clean install`
4.  Deploy the generated WAR file (located in the `target` directory) to a servlet container such as Tomcat.
5.  The backend services will be available at `http://localhost:8081/Bidding/`.

## Payment Project 😽

### Description
This project is a Java web application that provides a payment processing service. It uses a servlet to handle payment requests and stores payment information in a SQLite database. This project is intended to be used with a separate frontend application.

### How to Run
1.  Make sure you have Java and Maven installed.
2.  Navigate to the `Payment` directory.
3.  Build the project using Maven: `mvn clean install`
4.  Deploy the generated WAR file (located in the `target` directory) to a servlet container such as Tomcat.
5.  The payment service will be available at `http://localhost:8082/Payment/PaymentServlet`.

## Web Project 😻

### Description
This project is a Next.js application that serves as the frontend for a bidding system called MeowMart, a platform for buying and selling items, specifically cats. It interacts with the backend services provided by the Bidding and Payment projects. It uses WebSockets for real-time updates and provides a user interface for browsing items, placing bids, and processing payments.

### How to Run
To run the Next.js frontend:
1.  Make sure you have Node.js and npm installed.
2.  Navigate to the `web` directory.
3.  Install the dependencies: `npm install`
4.  Run the development server: `npm run dev`
5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Instructions

To run the project using Docker, you will need to have Docker and Docker Compose installed on your system.

Before running the project, you may need to pull the required Docker images. The `Authentication` service uses the `tomcat:9.0.98-jdk8` image. You can pull this image using the following command:

`docker pull tomcat:9.0.98-jdk8`

1.  Navigate to the root directory of the project (where the `docker-compose.yml` file is located).
2.  Run the following command to build and start the containers: `docker-compose up --build`
3.  Once the containers are up and running, you can access the web frontend at `http://localhost:3000`.
