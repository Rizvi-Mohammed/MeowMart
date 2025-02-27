# Authentication Project

## Description
This project is a Java web application that demonstrates user authentication using servlets and WebSockets. It allows users to log in and interact with a WebSocket endpoint.

## How to Run
1.  Make sure you have Java and Maven installed.
2.  Navigate to the `Authentication` directory.
3.  Build the project using Maven: `mvn clean install`
4.  Deploy the generated WAR file (located in the `target` directory) to a servlet container such as Tomcat.
5.  Access the application through your browser at `http://localhost:8080/Authentication/`.
6.  You can interact with the WebSocket endpoint using the `WebSocketClient.html` file.

## Details
-   The application uses servlets for handling login requests.
-   It uses WebSockets for real-time communication.
-   The WebSocket endpoint is located at `ws://localhost:8080/Authentication/websocketendpoint`.
-   The login servlet is located at `/login`.
