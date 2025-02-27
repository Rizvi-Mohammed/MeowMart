package server.util;

import java.util.ArrayList;
import java.util.List;
import server.model.Item;

/**
 * Utility class for managing items in memory if needed.
 * Primary data storage is handled by the SQLite database.
 */
public class ItemListUtility {

  private static List<Item> items = new ArrayList<>();

  public static List<Item> getItems() {
    return new ArrayList<>(items);
  }

  public static void addItem(Item item) {
    items.add(item);
  }

  public static void removeItem(Item item) {
    items.remove(item);
  }

  public static void clearItems() {
    items.clear();
  }
}
