package server.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.*;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import server.model.Item;
import server.util.DatabaseManager;

@ServerEndpoint("/biddingSocket/{itemId}")
public class BiddingWebSocketEndpoint {

  private static final Map<String, Double> startingPrices = new ConcurrentHashMap<>();
  private static final Map<String, Double> reservePrices = new ConcurrentHashMap<>();
  private static final Map<String, String> auctionTypes = new ConcurrentHashMap<>();
  private static final Map<String, Set<Session>> itemSessions = new ConcurrentHashMap<>();
  private final WebSocketSessionManager sessionManager = new WebSocketSessionManager();

  private static final ForwardAuctionManager forwardAuctionManager = new ForwardAuctionManager(
    startingPrices,
    itemSessions
  );
  private static final DutchAuctionManager dutchAuctionManager = new DutchAuctionManager(
    startingPrices,
    reservePrices,
    itemSessions
  );
  private static final BidProcessor bidProcessor = new BidProcessor(
    forwardAuctionManager,
    dutchAuctionManager
  );

  private static final ObjectMapper objectMapper = new ObjectMapper();

  static {
    System.out.println(
      "[BiddingWebSocketEndpoint] Static initialization complete"
    );
    System.out.println(
      "[BiddingWebSocketEndpoint] ForwardAuctionManager and DutchAuctionManager created"
    );
  }

  @OnOpen
  public void onOpen(Session session, @PathParam("itemId") String itemId) {
    System.out.println(
      "[BiddingWebSocketEndpoint] New WebSocket connection opened for item: " +
      itemId
    );
    System.out.println(
      "[BiddingWebSocketEndpoint] Session ID: " + session.getId()
    );

    try {
      sessionManager.addSession(itemId, session);
      System.out.println(
        "[BiddingWebSocketEndpoint] Session added to manager for item: " +
        itemId
      );

      if (!startingPrices.containsKey(itemId)) {
        System.out.println(
          "[BiddingWebSocketEndpoint] First connection for item: " +
          itemId +
          ". Initializing auction..."
        );

        Item item = DatabaseManager
          .getInstance()
          .getItemById(Integer.parseInt(itemId));
        if (item == null) {
          System.out.println(
            "[BiddingWebSocketEndpoint] Error: Item not found: " + itemId
          );
          sendErrorMessage(session, "Item not found");
          return;
        }

        startingPrices.put(itemId, item.getStartingPrice());
        reservePrices.put(itemId, item.getReservePrice());
        auctionTypes.put(itemId, item.getAuctionType());

        System.out.println(
          "[BiddingWebSocketEndpoint] Item details - Type: " +
          item.getAuctionType() +
          ", Starting Price: " +
          item.getStartingPrice()
        );

        itemSessions
          .computeIfAbsent(itemId, k -> ConcurrentHashMap.newKeySet())
          .add(session);

        // Start the appropriate auction based on type
        if ("forward".equalsIgnoreCase(item.getAuctionType())) {
          System.out.println(
            "[BiddingWebSocketEndpoint] Starting forward auction for item: " +
            itemId
          );
          forwardAuctionManager.startAuction(itemId, session);
        } else if ("dutch".equalsIgnoreCase(item.getAuctionType())) {
          System.out.println(
            "[BiddingWebSocketEndpoint] Starting dutch auction for item: " +
            itemId
          );
          dutchAuctionManager.startAuction(itemId, session);
        } else {
          System.out.println(
            "[BiddingWebSocketEndpoint] Error: Invalid auction type: " +
            item.getAuctionType()
          );
          sendErrorMessage(session, "Invalid auction type");
          return;
        }
      } else {
        System.out.println(
          "[BiddingWebSocketEndpoint] Joining existing auction for item: " +
          itemId
        );
        // Add session to existing auction
        itemSessions.get(itemId).add(session);
        String auctionType = auctionTypes.get(itemId);
        System.out.println(
          "[BiddingWebSocketEndpoint] Auction type: " + auctionType
        );

        if ("forward".equalsIgnoreCase(auctionType)) {
          System.out.println(
            "[BiddingWebSocketEndpoint] Connecting to existing forward auction"
          );
          forwardAuctionManager.startAuction(itemId, session);
        } else if ("dutch".equalsIgnoreCase(auctionType)) {
          System.out.println(
            "[BiddingWebSocketEndpoint] Connecting to existing dutch auction"
          );
          dutchAuctionManager.startAuction(itemId, session);
        }
      }

      sendInitialState(session, itemId);
      System.out.println(
        "[BiddingWebSocketEndpoint] Initial state sent to client for item: " +
        itemId
      );
    } catch (Exception e) {
      System.err.println(
        "[BiddingWebSocketEndpoint] Error in onOpen: " + e.getMessage()
      );
      e.printStackTrace();
      sendErrorMessage(
        session,
        "Error initializing auction: " + e.getMessage()
      );
    }
  }

  @OnMessage
  public void onMessage(
    String message,
    Session session,
    @PathParam("itemId") String itemId
  ) {
    System.out.println(
      "[BiddingWebSocketEndpoint] Received message for item: " + itemId
    );
    System.out.println(
      "[BiddingWebSocketEndpoint] Message content: " + message
    );
    bidProcessor.processBid(message, session, itemId);
  }

  private void sendInitialState(Session session, String itemId) {
    try {
      ObjectNode state = objectMapper.createObjectNode();
      state.put("itemId", itemId);
      state.put("startingPrice", startingPrices.get(itemId));
      state.put("reservePrice", reservePrices.get(itemId));
      state.put("auctionType", auctionTypes.get(itemId));
      state.put("message", "Connected to auction");

      String stateJson = state.toString();
      System.out.println(
        "[BiddingWebSocketEndpoint] Sending initial state: " + stateJson
      );
      session.getBasicRemote().sendText(stateJson);
    } catch (IOException e) {
      System.err.println(
        "[BiddingWebSocketEndpoint] Error sending initial state: " +
        e.getMessage()
      );
      e.printStackTrace();
    }
  }

  private void sendErrorMessage(Session session, String errorMessage) {
    try {
      System.out.println(
        "[BiddingWebSocketEndpoint] Sending error message: " + errorMessage
      );
      ObjectNode errorResponse = objectMapper.createObjectNode();
      errorResponse.put("error", errorMessage);
      session.getBasicRemote().sendText(errorResponse.toString());
    } catch (IOException e) {
      System.err.println(
        "[BiddingWebSocketEndpoint] Error sending error message: " +
        e.getMessage()
      );
      e.printStackTrace();
    }
  }

  @OnClose
  public void onClose(Session session, @PathParam("itemId") String itemId) {
    System.out.println(
      "[BiddingWebSocketEndpoint] WebSocket connection closed for item: " +
      itemId
    );
    System.out.println(
      "[BiddingWebSocketEndpoint] Session ID: " + session.getId()
    );
    sessionManager.removeSession(itemId, session);
  }
}
