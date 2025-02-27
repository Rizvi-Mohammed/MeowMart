package server.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import server.model.Item;
import server.util.DatabaseManager;

@WebServlet("/ItemServlet")
public class ItemServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;
  private static final ObjectMapper objectMapper = new ObjectMapper();
  private String DB_URL = "";

  @Override
  public void init(ServletConfig config) throws ServletException {
    super.init(config);
    ServletContext context = config.getServletContext();

    // Resolve the database path
    String dbPath = context.getRealPath("/WEB-INF/Items.db");
    DB_URL = "jdbc:sqlite:" + dbPath;

    // Check if the database file exists
    File dbFile = new File(dbPath);
    System.out.println("Database Path: " + dbPath);
    System.out.println("Database exists: " + dbFile.exists());

    if (!dbFile.exists()) {
      throw new ServletException("Database file not found at: " + dbPath);
    }

    // Load SQLite JDBC driver
    try {
      Class.forName("org.sqlite.JDBC");
      System.out.println("SQLite JDBC driver loaded successfully.");
    } catch (ClassNotFoundException e) {
      throw new ServletException("SQLite JDBC driver not found", e);
    }

    // Initialize DatabaseManager with the correct path
    DatabaseManager.getInstance().init(context.getRealPath("/"));

    // Test connection
    try (Connection conn = DriverManager.getConnection(DB_URL)) {
      System.out.println("Test connection successful.");
    } catch (SQLException e) {
      throw new ServletException("Failed to connect to database at init", e);
    }
  }

  @Override
  protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
    setAccessControlHeaders(resp);
    resp.setStatus(HttpServletResponse.SC_OK);
  }

  private void setAccessControlHeaders(HttpServletResponse resp) {
    resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    resp.setHeader("Access-Control-Allow-Credentials", "true");
  }

  @Override
  protected void doGet(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws ServletException, IOException {
    setAccessControlHeaders(response);

    List<Item> items = new ArrayList<>();
    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rs = null;

    try {
      System.out.println("Attempting to connect to the database.");
      conn = DriverManager.getConnection(DB_URL);
      System.out.println("Successfully connected to the database.");

      // Updated SQL query to include new fields: username, catBreed, and age
      String sql =
        "SELECT itemID, itemName, auctionType, startingPrice, reservePrice, username, catBreed, age FROM Cats";
      pstmt = conn.prepareStatement(sql);
      System.out.println("Executing SQL query: " + sql);
      rs = pstmt.executeQuery();

      // Process the result set and add items to the list
      while (rs.next()) {
        int itemID = rs.getInt("itemID");
        String itemName = rs.getString("itemName");
        String auctionType = rs.getString("auctionType");
        double startingPrice = rs.getDouble("startingPrice");
        double reservePrice = rs.getDouble("reservePrice");
        String username = rs.getString("username"); // Nullable
        String catBreed = rs.getString("catBreed");
        int age = rs.getInt("age");

        items.add(
          new Item(
            itemID,
            itemName,
            auctionType,
            startingPrice,
            reservePrice,
            username,
            catBreed,
            age
          )
        );
      }

      // Send response as JSON
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");
      String jsonItems = objectMapper.writeValueAsString(items);
      response.getWriter().write(jsonItems);
      System.out.println("Successfully retrieved items and sent response.");
    } catch (SQLException e) {
      System.out.println("Error accessing database: " + e.getMessage());
      e.printStackTrace();
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      String errorJson = objectMapper.writeValueAsString(
        new ErrorResponse("Error accessing database: " + e.getMessage())
      );
      response.getWriter().write(errorJson);
    } finally {
      try {
        if (rs != null) rs.close();
        if (pstmt != null) pstmt.close();
        if (conn != null) conn.close();
      } catch (SQLException e) {
        System.out.println("Error closing resources: " + e.getMessage());
      }
    }
  }

  // Helper class for error responses
  static class ErrorResponse {

    private String message;

    public ErrorResponse(String message) {
      this.message = message;
    }

    public String getMessage() {
      return message;
    }

    public void setMessage(String message) {
      this.message = message;
    }
  }

  @Override
  protected void doPost(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws ServletException, IOException {
    setAccessControlHeaders(response);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    Connection conn = null;
    PreparedStatement pstmt = null;

    try {
      conn = DriverManager.getConnection(DB_URL);

      // Parse JSON input
      JsonNode itemJson = objectMapper.readTree(request.getReader());
      String itemName = itemJson.get("itemName").asText();
      String auctionType = itemJson.get("auctionType").asText();
      double startingPrice = itemJson.get("startingPrice").asDouble();
      double reservePrice = itemJson.get("reservePrice").asDouble();
      String username = itemJson.has("username")
        ? itemJson.get("username").asText()
        : null;
      String catBreed = itemJson.get("catBreed").asText();
      int age = itemJson.get("age").asInt();

      // Updated SQL query to insert new fields
      String sql =
        "INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) VALUES (?, ?, ?, ?, ?, ?, ?)";
      pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, itemName);
      pstmt.setString(2, auctionType);
      pstmt.setDouble(3, startingPrice);
      pstmt.setDouble(4, reservePrice);
      pstmt.setString(5, username);
      pstmt.setString(6, catBreed);
      pstmt.setInt(7, age);

      int affectedRows = pstmt.executeUpdate();

      if (affectedRows > 0) {
        response.setStatus(HttpServletResponse.SC_CREATED);
        response
          .getWriter()
          .write("{\"message\": \"Item added successfully\"}");
      } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"message\": \"Failed to add item\"}");
      }
    } catch (SQLException e) {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response
        .getWriter()
        .write(
          "{\"message\": \"Error adding item to database: " +
          e.getMessage() +
          "\"}"
        );
      e.printStackTrace();
    } finally {
      try {
        if (pstmt != null) pstmt.close();
        if (conn != null) conn.close();
      } catch (SQLException e) {
        System.out.println("Error closing resources: " + e.getMessage());
      }
    }
  }
}
