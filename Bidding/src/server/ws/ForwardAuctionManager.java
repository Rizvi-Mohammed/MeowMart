package server.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;
import javax.websocket.RemoteEndpoint;
import javax.websocket.Session;

public class ForwardAuctionManager implements AuctionManager {

  private final Map<String, Double> currentBids = new ConcurrentHashMap<>();
  private final Map<String, String> currentBidders = new ConcurrentHashMap<>();
  private final Map<String, Double> startingPrices;
  private final Map<String, Set<Session>> itemSessions;
  private final Map<String, ScheduledFuture<?>> auctionTimers = new ConcurrentHashMap<>();
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final ScheduledExecutorService scheduler;
  private static final int AUCTION_DURATION_SECONDS = 30;

  public ForwardAuctionManager(
    Map<String, Double> startingPrices,
    Map<String, Set<Session>> itemSessions
  ) {
    this.startingPrices = startingPrices;
    this.itemSessions = itemSessions;
    this.scheduler =
      Executors.newScheduledThreadPool(
        1,
        r -> {
          Thread t = new Thread(r);
          t.setDaemon(true); // Make thread daemon so it doesn't prevent JVM shutdown
          return t;
        }
      );
    System.out.println(
      "[ForwardAuctionManager] Initialized with new scheduler"
    );
  }

  @Override
  public void startAuction(String itemId, Session session) {
    System.out.println(
      "[ForwardAuctionManager] Starting auction for item: " + itemId
    );

    System.out.println("current bids" + currentBids);

    synchronized (this) {
      // Initialize the current bid with the starting price if not already set
      if (!currentBids.containsKey(itemId)) {
        double startingPrice = startingPrices.get(itemId);
        currentBids.put(itemId, startingPrice);
        System.out.println(
          "[ForwardAuctionManager] Setting initial bid for item " +
          itemId +
          " to " +
          startingPrice
        );
      }

      // Schedule initial timer only if no bids have been placed
      if (
        !currentBids.containsKey(itemId) ||
        currentBids.get(itemId).equals(startingPrices.get(itemId))
      ) {
        scheduleAuctionEnd(itemId);
      } else {
        System.out.println(
          "[ForwardAuctionManager] Auction already running for item: " + itemId
        );
      }
    }

    sendAuctionState(session, itemId);
  }

  private synchronized void scheduleAuctionEnd(String itemId) {
    System.out.println(
      "[ForwardAuctionManager] Attempting to schedule auction end timer for item: " +
      itemId
    );

    try {
      // Cancel any existing timer
      ScheduledFuture<?> existingTimer = auctionTimers.get(itemId);
      if (existingTimer != null) {
        System.out.println(
          "[ForwardAuctionManager] Cancelling existing timer for item: " +
          itemId
        );
        existingTimer.cancel(false);
        auctionTimers.remove(itemId);
      }

      // Create new timer with a Runnable that captures itemId
      if (
        !currentBids.containsKey(itemId) ||
        currentBids.get(itemId).equals(startingPrices.get(itemId))
      ) {
        System.out.println(
          "[ForwardAuctionManager] No bids placed for item: " +
          itemId +
          ". Not scheduling timer."
        );
        return;
      }

      final String capturedItemId = itemId; // Capture for lambda
      Runnable endAuctionTask = () -> {
        System.out.println(
          "[ForwardAuctionManager] Timer triggered for item: " + capturedItemId
        );
        try {
          endAuction(capturedItemId);
        } catch (Exception e) {
          System.err.println(
            "[ForwardAuctionManager] Error in timer task for item " +
            capturedItemId +
            ": " +
            e.getMessage()
          );
          e.printStackTrace();
        }
      };

      // Schedule the new timer
      ScheduledFuture<?> newTimer = scheduler.schedule(
        endAuctionTask,
        AUCTION_DURATION_SECONDS,
        TimeUnit.SECONDS
      );

      auctionTimers.put(itemId, newTimer);
      System.out.println(
        "[ForwardAuctionManager] Successfully scheduled new timer for item: " +
        itemId +
        " to end in " +
        AUCTION_DURATION_SECONDS +
        " seconds"
      );
    } catch (Exception e) {
      System.err.println(
        "[ForwardAuctionManager] Error scheduling timer for item " +
        itemId +
        ": " +
        e.getMessage()
      );
      e.printStackTrace();
    }
  }

  @Override
  public synchronized void processBid(
    String itemId,
    double bidAmount,
    String username,
    Session session
  ) {
    System.out.println(
      "[ForwardAuctionManager] Processing bid for item: " +
      itemId +
      ", amount: " +
      bidAmount +
      ", bidder: " +
      username
    );

    Double currentBid = currentBids.get(itemId);
    if (currentBid == null) {
      currentBid = startingPrices.get(itemId);
      if (currentBid == null) {
        System.out.println(
          "[ForwardAuctionManager] Error: Invalid item ID or starting price not set for item: " +
          itemId
        );
        sendErrorMessage(session, "Invalid item ID or starting price not set");
        return;
      }
      currentBids.put(itemId, currentBid);
    }

    if (bidAmount <= currentBid) {
      System.out.println(
        "[ForwardAuctionManager] Bid rejected: Amount too low for item: " +
        itemId
      );
      sendErrorMessage(
        session,
        String.format("Bid must be higher than current bid: %.2f", currentBid)
      );
      return;
    }

    currentBids.put(itemId, bidAmount);
    currentBidders.put(itemId, username);

    System.out.println(
      "[ForwardAuctionManager] Bid accepted for item: " +
      itemId +
      ". Resetting timer..."
    );
    // Reset the timer when a new bid is placed
    scheduleAuctionEnd(itemId);

    String notificationMessage = createNotificationMessage(
      itemId,
      String.format("New highest bid: %.2f by %s", bidAmount, username)
    );
    broadcastUpdate(itemId, notificationMessage);
  }

  @Override
  public synchronized void endAuction(String itemId) {
    System.out.println(
      "[ForwardAuctionManager] Ending auction for item: " + itemId
    );

    // Check if auction is still active
    if (!currentBids.containsKey(itemId)) {
      System.out.println(
        "[ForwardAuctionManager] Auction already ended for item: " + itemId
      );
      return;
    }

    String winner = currentBidders.get(itemId);
    double winningBid = currentBids.getOrDefault(
      itemId,
      startingPrices.get(itemId)
    );

    String message = (winner != null)
      ? String.format(
        "Auction ended! Winner: %s with bid: %.2f",
        winner,
        winningBid
      )
      : "Auction ended! No bids were placed.";

    System.out.println("[ForwardAuctionManager] End message: " + message);
    String notificationMessage = createNotificationMessage(itemId, message);
    System.out.println(
      "[ForwardAuctionManager] Broadcasting end message: " + notificationMessage
    );

    broadcastUpdate(itemId, notificationMessage);
    cleanupAuctionState(itemId);
  }

  private synchronized void cleanupAuctionState(String itemId) {
    System.out.println(
      "[ForwardAuctionManager] Cleaning up auction state for item: " + itemId
    );
    currentBids.remove(itemId);
    currentBidders.remove(itemId);
    ScheduledFuture<?> timer = auctionTimers.remove(itemId);
    if (timer != null) {
      timer.cancel(false);
    }
  }

  private void sendAuctionState(Session session, String itemId) {
    try {
      ObjectNode state = objectMapper.createObjectNode();
      state.put("itemId", itemId);
      state.put(
        "currentBid",
        currentBids.getOrDefault(itemId, startingPrices.get(itemId))
      );
      state.put(
        "currentBidder",
        currentBidders.getOrDefault(itemId, "No bids yet")
      );
      state.put("message", "Connected to auction");
      // Calculate remaining time
      ScheduledFuture<?> timer = auctionTimers.get(itemId);
      long remainingTime = AUCTION_DURATION_SECONDS; // Default to full duration
      if (timer != null && !timer.isDone()) {
        long delay = timer.getDelay(TimeUnit.SECONDS);
        remainingTime = Math.max(0, delay); // Ensure remaining time is not negative
      }
      state.put("remainingTime", remainingTime);

      session.getBasicRemote().sendText(state.toString());
      System.out.println(
        "[ForwardAuctionManager] Sent auction state to client for item: " +
        itemId
      );
    } catch (IOException e) {
      System.err.println(
        "[ForwardAuctionManager] Error sending auction state: " + e.getMessage()
      );
      e.printStackTrace();
    }
  }

  private void broadcastUpdate(String itemId, String message) {
    Set<Session> sessions = itemSessions.getOrDefault(
      itemId,
      java.util.Collections.emptySet()
    );
    System.out.println(
      "[ForwardAuctionManager] Broadcasting to " +
      sessions.size() +
      " sessions for item: " +
      itemId +
      ", message: " +
      message
    );

    for (Session session : sessions) {
      if (session.isOpen()) {
        try {
          session.getBasicRemote().sendText(message);
          System.out.println(
            "[ForwardAuctionManager] Successfully sent message to session: " +
            session.getId()
          );
        } catch (IOException e) {
          System.err.println(
            "[ForwardAuctionManager] Error broadcasting to session " +
            session.getId() +
            ": " +
            e.getMessage()
          );
          e.printStackTrace();
        }
      } else {
        System.out.println(
          "[ForwardAuctionManager] Skipping closed session: " + session.getId()
        );
      }
    }
  }

  private String createNotificationMessage(String itemId, String message) {
    ObjectNode notification = objectMapper.createObjectNode();
    notification.put("itemId", itemId);
    notification.put("message", message);
    notification.put(
      "currentBid",
      currentBids.getOrDefault(itemId, startingPrices.get(itemId))
    );
    notification.put("currentBidder", currentBidders.getOrDefault(itemId, ""));
    return notification.toString();
  }

  private void sendErrorMessage(Session session, String errorMessage) {
    try {
      ObjectNode errorResponse = objectMapper.createObjectNode();
      errorResponse.put("error", errorMessage);
      session.getBasicRemote().sendText(errorResponse.toString());
      System.out.println(
        "[ForwardAuctionManager] Sent error message to client: " + errorMessage
      );
    } catch (IOException e) {
      System.err.println(
        "[ForwardAuctionManager] Error sending error message: " + e.getMessage()
      );
      e.printStackTrace();
    }
  }
}
