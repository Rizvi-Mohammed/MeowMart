package server.ws;

import javax.websocket.Session;

public interface AuctionManager {
  void startAuction(String itemId, Session session);
  void processBid(
    String itemId,
    double bidAmount,
    String username,
    Session session
  );
  void endAuction(String itemId);
}
