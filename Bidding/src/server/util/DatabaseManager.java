package server.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import server.model.Item;

/**
 * Singleton class for managing database connections and common database operations.
 */
public class DatabaseManager {

  private static DatabaseManager instance;
  private String dbUrl;

  private DatabaseManager() {}

  public static DatabaseManager getInstance() {
    if (instance == null) {
      instance = new DatabaseManager();
    }
    return instance;
  }

  public void init(String contextPath) {
    // Construct the database URL using the provided context path
    this.dbUrl = "jdbc:sqlite:" + contextPath + "/WEB-INF/Items.db";

    // Load SQLite JDBC driver
    try {
      Class.forName("org.sqlite.JDBC");
    } catch (ClassNotFoundException e) {
      throw new RuntimeException("SQLite JDBC driver not found", e);
    }

    // Test connection
    try (Connection conn = getConnection()) {
      if (conn != null) {
        System.out.println("Database connection successful: " + dbUrl);
      }
    } catch (SQLException e) {
      throw new RuntimeException("Failed to connect to database", e);
    }
  }

  public Connection getConnection() throws SQLException {
    if (dbUrl == null) {
      throw new SQLException(
        "Database URL not initialized. Call init() first."
      );
    }
    return DriverManager.getConnection(dbUrl);
  }

  /**
   * Utility method to fetch an item by its ID.
   */
  public Item getItemById(int itemId) throws SQLException {
    String sql =
      "SELECT itemID, itemName, auctionType, startingPrice, reservePrice, username, catBreed, age FROM Cats WHERE itemID = ?";

    try (
      Connection conn = getConnection();
      PreparedStatement pstmt = conn.prepareStatement(sql)
    ) {
      pstmt.setInt(1, itemId);
      ResultSet rs = pstmt.executeQuery();

      if (rs.next()) {
        return new Item(
          rs.getInt("itemID"),
          rs.getString("itemName"),
          rs.getString("auctionType"),
          rs.getDouble("startingPrice"),
          rs.getDouble("reservePrice"),
          rs.getString("username"),
          rs.getString("catBreed"),
          rs.getInt("age")
        );
      }
    }
    return null;
  }

  /**
   * Utility method to close database resources.
   */
  public static void closeResources(
    Connection conn,
    PreparedStatement pstmt,
    ResultSet rs
  ) {
    try {
      if (rs != null) rs.close();
      if (pstmt != null) pstmt.close();
      if (conn != null) conn.close();
    } catch (SQLException e) {
      System.err.println("Error closing database resources: " + e.getMessage());
    }
  }
}
