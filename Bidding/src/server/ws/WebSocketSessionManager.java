package server.ws;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.Session;

public class WebSocketSessionManager {

  private static final Map<String, Set<Session>> itemSessions = new ConcurrentHashMap<>();

  public void addSession(String itemId, Session session) {
    itemSessions
      .computeIfAbsent(itemId, k -> ConcurrentHashMap.newKeySet())
      .add(session);
  }

  public void removeSession(String itemId, Session session) {
    itemSessions.computeIfPresent(
      itemId,
      (key, sessions) -> {
        sessions.remove(session);
        return sessions.isEmpty() ? null : sessions;
      }
    );
  }

  public Set<Session> getSessions(String itemId) {
    return itemSessions.getOrDefault(itemId, java.util.Collections.emptySet());
  }
}
