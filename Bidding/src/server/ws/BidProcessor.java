package server.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.websocket.Session;

public class BidProcessor {

  private final AuctionManager forwardAuctionManager;
  private final AuctionManager dutchAuctionManager;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public BidProcessor(
    AuctionManager forwardAuctionManager,
    AuctionManager dutchAuctionManager
  ) {
    this.forwardAuctionManager = forwardAuctionManager;
    this.dutchAuctionManager = dutchAuctionManager;
    System.out.println("[BidProcessor] Initialized with auction managers");
  }

  public void processBid(String message, Session session, String itemId) {
    System.out.println("[BidProcessor] Processing message for item: " + itemId);
    System.out.println("[BidProcessor] Received message: " + message);

    try {
      JsonNode jsonMessage = objectMapper.readTree(message);

      if (!isValidMessage(jsonMessage)) {
        System.out.println("[BidProcessor] Invalid message format received");
        sendErrorMessage(session, "Invalid message format");
        return;
      }

      // Check if this is an auction end message
      if (
        jsonMessage.has("action") &&
        "end_auction".equals(jsonMessage.get("action").asText())
      ) {
        System.out.println(
          "[BidProcessor] Received auction end message for item: " + itemId
        );
        String auctionType = jsonMessage.get("auctionType").asText();

        if ("forward".equals(auctionType) || "highest".equals(auctionType)) {
          System.out.println(
            "[BidProcessor] Ending forward auction for item: " + itemId
          );
          forwardAuctionManager.endAuction(itemId);
        } else if ("dutch".equals(auctionType)) {
          System.out.println(
            "[BidProcessor] Ending dutch auction for item: " + itemId
          );
          dutchAuctionManager.endAuction(itemId);
        }
        return;
      }

      // Process regular bid message
      String username = jsonMessage.get("username").asText();
      double bidAmount = jsonMessage.get("bidAmount").asDouble();
      String auctionType = jsonMessage.get("auctionType").asText();

      System.out.println(
        "[BidProcessor] Processing bid - Username: " +
        username +
        ", Amount: " +
        bidAmount +
        ", Type: " +
        auctionType
      );

      if ("highest".equals(auctionType)) {
        auctionType = "forward";
        System.out.println(
          "[BidProcessor] Converted 'highest' to 'forward' auction type"
        );
      }

      if ("forward".equals(auctionType)) {
        System.out.println(
          "[BidProcessor] Forwarding to ForwardAuctionManager"
        );
        forwardAuctionManager.processBid(itemId, bidAmount, username, session);
      } else if ("dutch".equals(auctionType)) {
        System.out.println("[BidProcessor] Forwarding to DutchAuctionManager");
        dutchAuctionManager.processBid(itemId, bidAmount, username, session);
      } else {
        System.out.println(
          "[BidProcessor] Invalid auction type: " + auctionType
        );
        sendErrorMessage(session, "Invalid auction type");
      }
    } catch (Exception e) {
      System.err.println(
        "[BidProcessor] Error processing message: " + e.getMessage()
      );
      e.printStackTrace();
      sendErrorMessage(session, "Error processing message: " + e.getMessage());
    }
  }

  private boolean isValidMessage(JsonNode message) {
    // Check if it's an auction end message
    if (
      message.has("action") &&
      "end_auction".equals(message.get("action").asText())
    ) {
      boolean isValid = message.has("auctionType");
      System.out.println(
        "[BidProcessor] Auction end message validation result: " + isValid
      );
      return isValid;
    }

    // Regular bid message validation
    boolean isValid =
      message.has("username") &&
      message.has("bidAmount") &&
      message.has("auctionType") &&
      message.has("bidTime");

    System.out.println(
      "[BidProcessor] Bid message validation result: " + isValid
    );
    if (!isValid) {
      System.out.println(
        "[BidProcessor] Missing fields in message: " + message.toString()
      );
    }

    return isValid;
  }

  private void sendErrorMessage(Session session, String errorMessage) {
    try {
      System.out.println(
        "[BidProcessor] Sending error message: " + errorMessage
      );
      com.fasterxml.jackson.databind.node.ObjectNode errorResponse = objectMapper.createObjectNode();
      errorResponse.put("error", errorMessage);
      session.getBasicRemote().sendText(errorResponse.toString());
    } catch (IOException e) {
      System.err.println(
        "[BidProcessor] Error sending error message: " + e.getMessage()
      );
      e.printStackTrace();
    }
  }
}
