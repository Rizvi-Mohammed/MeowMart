<%@ page import="server.util.AuthValidator" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="server.model.Item" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Use AuthValidator to get the authenticated user
    String username = AuthValidator.isUserAuthenticated(request);

    // Redirect to login page if username is not found
    if (username == null) {
        response.sendRedirect("http://localhost:8080/Authentication/Auth.jsp");
        return;
    }
%>
<html>
<head>
    <title>Bidding System - Items List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        h1, h2 {
            text-align: center;
            color: #343a40;
        }
        ul {
            list-style-type: none;
            padding: 0;
            max-width: 600px;
            margin: 20px auto;
        }
        li {
            background: white;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        li a {
            text-decoration: none;
            font-size: 18px;
            color: #007bff;
            font-weight: bold;
        }
        li a:hover {
            color: #0056b3;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <h1>Welcome to the Bidding System</h1>
    <h2>Select an Item to Place Your Bid</h2>
     <ul>
        <%
            // Defining a list of items in Java
            List<Item> items = new ArrayList<>();

            // Creating items and adding them to the list
            items.add(new Item(1, "Item1", "highest", 1000.00, 0.00, "cat", "bebicat", 12));
            
            // Iterating through the list of items and displaying them
            for (Item item : items) {
        %>
        <li>
            <a href="placeBid.jsp?itemId=<%= item.getItemId() %>&auctionType=<%= item.getAuctionType() %>">
                Bid on <%= item.getItemName() %> (Auction Type: <%= item.getAuctionType().equals("highest") ? "Highest Bid" : "Dutch Forwarding" %>)
            </a>
        </li>
        <% } %>
    </ul>
</body>
</html>

