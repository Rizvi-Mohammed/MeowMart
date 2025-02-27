package server.ws;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/biddingApi")
public class BiddingServlet extends HttpServlet {

  /**
   *
   */
  private static final long serialVersionUID = 1L;
  private static final Map<String, Double> currentBids = new ConcurrentHashMap<>();
  private static final Map<String, String> currentBidders = new ConcurrentHashMap<>();
  private static final Map<String, ScheduledFuture<?>> timers = new ConcurrentHashMap<>();
  private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(
    10
  );
  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
    String itemId = req.getParameter("itemId");

    if (itemId == null || itemId.isEmpty()) {
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      resp.getWriter().write("{\"error\":\"Missing itemId parameter\"}");
      return;
    }

    double currentBid = currentBids.getOrDefault(itemId, 0.0);
    String currentBidder = currentBidders.getOrDefault(itemId, "No bids yet");

    ObjectNode response = objectMapper.createObjectNode();
    response.put("itemId", itemId);
    response.put("currentBid", currentBid);
    response.put("currentBidder", currentBidder);

    resp.setContentType("application/json");
    resp.getWriter().write(response.toString());
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
    String itemId = req.getParameter("itemId");
    String username = req.getParameter("username");
    String bidAmountStr = req.getParameter("bidAmount");

    if (itemId == null || username == null || bidAmountStr == null) {
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      resp.getWriter().write("{\"error\":\"Missing parameters\"}");
      return;
    }

    double bidAmount;
    try {
      bidAmount = Double.parseDouble(bidAmountStr);
    } catch (NumberFormatException e) {
      resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      resp.getWriter().write("{\"error\":\"Invalid bid amount\"}");
      return;
    }

    synchronized (currentBids) {
      double currentBid = currentBids.getOrDefault(itemId, 0.0);

      if (bidAmount > currentBid) {
        currentBids.put(itemId, bidAmount);
        currentBidders.put(itemId, username);

        if (timers.containsKey(itemId)) {
          timers.get(itemId).cancel(false);
        }

        timers.put(itemId, startTimer(itemId));

        ObjectNode response = objectMapper.createObjectNode();
        response.put("message", "Bid placed successfully");
        response.put("newBid", bidAmount);
        resp.setContentType("application/json");
        resp.getWriter().write(response.toString());
      } else {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        resp
          .getWriter()
          .write("{\"error\":\"Bid must be higher than the current bid\"}");
      }
    }
  }

  private ScheduledFuture<?> startTimer(String itemId) {
    return scheduler.schedule(
      () -> declareWinner(itemId),
      15,
      TimeUnit.SECONDS
    );
  }

  private void declareWinner(String itemId) {
    String winner = currentBidders.get(itemId);
    double winningBid = currentBids.getOrDefault(itemId, 0.0);

    System.out.println(
      "Auction ended! Winner: " + winner + " with bid: " + winningBid
    );

    // Clear auction state
    currentBids.remove(itemId);
    currentBidders.remove(itemId);
    timers.remove(itemId);
  }
}
