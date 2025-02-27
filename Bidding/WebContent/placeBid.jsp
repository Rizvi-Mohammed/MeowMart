<%@ page contentType="text/html;charset=UTF-8" language="java" %> <%@ page
import="server.util.AuthValidator" %> <% String itemId =
request.getParameter("itemId"); String auctionType =
request.getParameter("auctionType"); if (itemId == null) {
response.sendRedirect("index.jsp"); return; } String username =
AuthValidator.isUserAuthenticated(request); if (username == null) {
response.sendRedirect("http://localhost:8080/Authentication/Auth.jsp"); return;
} %>
<html>
  <head>
    <title>Place Bid for <%= itemId %></title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
      }
      h1 {
        text-align: center;
        background-color: #007bff;
        color: white;
        padding: 15px 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: white;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      .timer,
      .messages {
        font-size: 18px;
        margin: 10px 0;
        color: #333;
      }
      input[type="text"] {
        width: calc(100% - 110px);
        padding: 10px;
        margin-right: 10px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        font-size: 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #0056b3;
      }
      .error {
        color: red;
        margin: 10px 0;
      }
      .success {
        color: green;
        margin: 10px 0;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <h1>Bidding for Item: <%= itemId %></h1>
    <div id="messages">Connecting...</div>

    <div id="normalBidTimer" class="timer"></div>
    <!-- For normal auction countdown -->
    <div id="dutchTimer" class="timer"></div>
    <!-- For Dutch auction price countdown -->

    <input type="text" id="bid" placeholder="Enter your bid" />
    <button onclick="sendBid()">Place Bid</button>

    <script>
      const itemId = "<%= itemId %>";
      const username = "<%= username %>"; // Replace with user session logic
      const auctionType = "<%= auctionType %>";
      const socket = new WebSocket(
        "ws://localhost:8081/Bidding/biddingSocket/$" + itemId
      );

      // Variables for timers
      let countdownTimer;
      let priceReductionTimer;
      let timeRemaining = 30; // Default for Normal Auction
      let priceReductionTime = 10; // Default for Dutch Auction price reduction
      let currentPrice = 1000; // Example starting price for Dutch Auction
      let timerStarted = false; // Flag to track if the timer has started
      let sec = 30;
      var timer;

      function startTimer() {
        if (timer) {
          clearInterval(timer);
        }
        // Restart the timer with the current sec value
        timer = setInterval(function () {
          document.getElementById("normalBidTimer").innerHTML =
            "00:" + (sec < 10 ? "0" + sec : sec); // Ensure formatting
          sec--;
          if (sec < 0) {
            clearInterval(timer);
          }
        }, 1000);
      }

      socket.onopen = () => {
        document.getElementById("messages").innerHTML +=
          "<p>Connected to bidding server.</p>";
        document.getElementById("messages").innerHTML +=
          "<p>Connected to bidding server.</p>";
        if (auctionType === "highest") {
          // Start Normal Highest Bid timer
        } else {
          startDutchAuctionTimer(); // Start Dutch Forward Auction price reduction timer
          document.getElementById("dutchTimer").innerHTML =
            "<p>Starting at </p>" + currentPrice;
        }
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
          document.getElementById("messages").innerHTML +=
            "<p class='error'>" + data.error + "</p>";
        } else {
          document.getElementById("messages").innerHTML +=
            "<p>" +
            data.message +
            " (Current Bid: " +
            data.currentBid +
            ", Bidder: " +
            data.currentBidder +
            ")</p>";
          if (
            !data.message.includes("Auction ended") &&
            auctionType != "dutch"
          ) {
            sec = 30;
            startTimer();
          }
          if (
            data.message.includes("Auction ended") &&
            auctionType == "dutch"
          ) {
            clearInterval(priceReductionTimer);
          }
        }
      };

      socket.onclose = () => {
        document.getElementById("messages").innerHTML +=
          "<p>Connection closed.</p>";
      };

      function sendBid() {
        const bid = document.getElementById("bid").value.trim();
        if (!bid || isNaN(bid) || Number(bid) <= 0) {
          document.getElementById("messages").innerHTML +=
            "<p class='error'>Invalid bid amount.</p>";
          return;
        }

        const message = JSON.stringify({
          username: username,
          bidAmount: parseFloat(bid),
          auctionType: auctionType, // Ensure auctionType is set (either "highest" or "dutch")
          bidTime: new Date().toISOString(), // Ensure bidTime is included
        });

        console.log(message);
        socket.send(message);
      }

      // Dutch Forward Auction Price Reduction Timer
      function startDutchAuctionTimer() {
        priceReductionTimer = setInterval(function () {
          currentPrice -= 50; // Reduce price by 50 each interval (example)
          // Using string concatenation instead of template literals
          document.getElementById("dutchTimer").innerText =
            "Current Price: $" + currentPrice;
          if (currentPrice <= 500) {
            // Reserve price reached
            clearInterval(priceReductionTimer);
            document.getElementById("dutchTimer").innerText =
              "Reserve Price Reached!";
          }
        }, 10000); // Price reduction every 10 seconds
      }
    </script>
  </body>
</html>
