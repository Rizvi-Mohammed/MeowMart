package server.ws;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import javax.websocket.Session;

public class DutchAuctionManager implements AuctionManager {

  private final Map<String, Double> currentBids = new ConcurrentHashMap<>();
  private final Map<String, String> currentBidders = new ConcurrentHashMap<>();
  private final Map<String, Double> startingPrices;
  private final Map<String, Double> reservePrices;
  private final Map<String, Double> priceDecrements = new ConcurrentHashMap<>();
  private final Map<String, ScheduledFuture<?>> priceDecrementTimers = new ConcurrentHashMap<>();
  private final Map<String, Integer> countdownTimers = new ConcurrentHashMap<>();
  private final Map<String, Set<Session>> itemSessions;
  private static final ObjectMapper objectMapper = new ObjectMapper();
  private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(
    10
  );
  private static final double DUTCH_PRICE_DECREMENT_PERCENTAGE = 0.05;
  private static final int PRICE_DECREMENT_INTERVAL = 15; // Price decrement every 15 seconds

  public DutchAuctionManager(
    Map<String, Double> startingPrices,
    Map<String, Double> reservePrices,
    Map<String, Set<Session>> itemSessions
  ) {
    this.startingPrices = startingPrices;
    this.reservePrices = reservePrices;
    this.itemSessions = itemSessions;
  }

  @Override
  public void startAuction(String itemId, Session session) {
    double priceDecrement =
      startingPrices.get(itemId) * DUTCH_PRICE_DECREMENT_PERCENTAGE;
    priceDecrements.put(itemId, priceDecrement);
    currentBids.put(itemId, startingPrices.get(itemId));
    countdownTimers.put(itemId, 0); // Start at 0 to wait for first countdown
    sendAuctionState(session, itemId);
    schedulePriceDecrement(itemId);
  }

  @Override
  public void processBid(
    String itemId,
    double bidAmount,
    String username,
    Session session
  ) {
    double currentPrice = getCurrentDutchPrice(itemId);

    if (bidAmount < currentPrice) {
      sendErrorMessage(
        session,
        String.format("Bid must be at least %.2f", currentPrice)
      );
      return;
    }

    // Accept the first valid bid in Dutch auction
    currentBids.put(itemId, bidAmount);
    currentBidders.put(itemId, username);

    // Stop the timer and end the auction
    stopPriceDecrementTimer(itemId);

    // Broadcast the winning bid
    broadcastUpdate(
      itemId,
      createBidNotificationMessage(itemId, username, bidAmount)
    );

    // End the auction with this winner
    declareWinner(itemId);
  }

  @Override
  public void endAuction(String itemId) {
    declareWinner(itemId);
  }

  private double getCurrentDutchPrice(String itemId) {
    double currentPrice = startingPrices.get(itemId);
    double decrement = priceDecrements.get(itemId);
    int timeElapsed = countdownTimers.getOrDefault(itemId, 0);

    for (int i = 0; i < timeElapsed; i++) {
      currentPrice -= decrement;
    }

    return Math.max(currentPrice, reservePrices.get(itemId));
  }

  private void schedulePriceDecrement(String itemId) {
    ScheduledFuture<?> existingTimer = priceDecrementTimers.get(itemId);
    if (existingTimer != null) {
      existingTimer.cancel(false);
      priceDecrementTimers.remove(itemId);
    }

    Runnable priceDecrementTask = () -> {
      countdownTimers.put(itemId, countdownTimers.get(itemId) + 1);

      double currentPrice = getCurrentDutchPrice(itemId);
      double reservePrice = reservePrices.get(itemId);

      if (currentPrice < reservePrice) {
        stopPriceDecrementTimer(itemId);
        broadcastUpdate(
          itemId,
          createNotificationMessage(
            itemId,
            "Auction ended: Reserve price exceeded"
          )
        );
        declareWinner(itemId);
      } else {
        broadcastUpdate(
          itemId,
          createPriceUpdateMessage(
            itemId,
            currentPrice,
            countdownTimers.get(itemId)
          )
        );
      }
    };

    ScheduledFuture<?> newTimer = scheduler.scheduleAtFixedRate(
      priceDecrementTask,
      PRICE_DECREMENT_INTERVAL,
      PRICE_DECREMENT_INTERVAL,
      TimeUnit.SECONDS
    );

    priceDecrementTimers.put(itemId, newTimer);
  }

  private void stopPriceDecrementTimer(String itemId) {
    ScheduledFuture<?> timer = priceDecrementTimers.remove(itemId);
    if (timer != null) {
      timer.cancel(false);
    }
  }

  private void declareWinner(String itemId) {
    String winner = currentBidders.get(itemId);
    double winningBid = currentBids.getOrDefault(itemId, 0.0);

    String message = (winner != null)
      ? String.format(
        "Auction ended! Winner: %s with bid: %.2f",
        winner,
        winningBid
      )
      : "Auction ended! Reserve price reached.";

    broadcastUpdate(itemId, createNotificationMessage(itemId, message));
    cleanupAuctionState(itemId);
  }

  private void cleanupAuctionState(String itemId) {
    currentBids.remove(itemId);
    currentBidders.remove(itemId);
    countdownTimers.remove(itemId);
    priceDecrements.remove(itemId);
    stopPriceDecrementTimer(itemId);
  }

  private void sendAuctionState(Session session, String itemId) {
    try {
      ObjectNode state = objectMapper.createObjectNode();
      state.put("itemId", itemId);
      state.put("currentBid", getCurrentDutchPrice(itemId));
      state.put(
        "currentBidder",
        currentBidders.getOrDefault(itemId, "No bids yet")
      );
      state.put("message", "Connected to Dutch auction");
      state.put("auctionType", "dutch");
      state.put("countdownTimer", countdownTimers.getOrDefault(itemId, 0));

      session.getBasicRemote().sendText(state.toString());
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private String createPriceUpdateMessage(
    String itemId,
    double currentPrice,
    int timeElapsed
  ) {
    ObjectNode notification = objectMapper.createObjectNode();
    notification.put("itemId", itemId);
    notification.put("currentBid", currentPrice);
    notification.put(
      "message",
      String.format("Price lowered to: %.2f", currentPrice)
    );
    notification.put("currentBidder", currentBidders.getOrDefault(itemId, ""));
    notification.put("countdownTimer", timeElapsed);
    return notification.toString();
  }

  private String createBidNotificationMessage(
    String itemId,
    String bidder,
    double amount
  ) {
    ObjectNode notification = objectMapper.createObjectNode();
    notification.put("itemId", itemId);
    notification.put("currentBid", amount);
    notification.put("currentBidder", bidder);
    notification.put("bidder", bidder);
    notification.put("amount", amount);
    notification.put(
      "message",
      String.format("Bid accepted: %.2f by %s", amount, bidder)
    );
    return notification.toString();
  }

  private String createNotificationMessage(String itemId, String message) {
    ObjectNode notification = objectMapper.createObjectNode();
    notification.put("itemId", itemId);
    notification.put("message", message);
    notification.put("currentBid", getCurrentDutchPrice(itemId));
    notification.put("currentBidder", currentBidders.getOrDefault(itemId, ""));
    return notification.toString();
  }

  private void broadcastUpdate(String itemId, String message) {
    Set<Session> sessions = itemSessions.getOrDefault(
      itemId,
      java.util.Collections.emptySet()
    );
    for (Session session : sessions) {
      if (session.isOpen()) {
        try {
          session.getBasicRemote().sendText(message);
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  private void sendErrorMessage(Session session, String errorMessage) {
    try {
      ObjectNode errorResponse = objectMapper.createObjectNode();
      errorResponse.put("error", errorMessage);
      session.getBasicRemote().sendText(errorResponse.toString());
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
