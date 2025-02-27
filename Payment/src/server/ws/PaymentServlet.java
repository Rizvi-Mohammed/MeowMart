package server.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import server.model.Payment;
import server.util.DatabaseManager;

@WebServlet("/PaymentServlet")
public class PaymentServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;
  private static final ObjectMapper objectMapper = new ObjectMapper();
  private String DB_URL = "";

  @Override
  public void init(ServletConfig config) throws ServletException {
    super.init(config);
    ServletContext context = config.getServletContext();

    // Initialize DatabaseManager with the correct path
    DatabaseManager.getInstance().init(context.getRealPath("/"));

    // Resolve the database path
    String dbPath = context.getRealPath("/WEB-INF/Payments.db");
    DB_URL = "jdbc:sqlite:" + dbPath;

    // Check if the database file exists
    java.io.File dbFile = new java.io.File(dbPath);
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
      JsonNode paymentJson = objectMapper.readTree(request.getReader());
      String itemId = paymentJson.get("itemId").asText();
      String username = paymentJson.get("username").asText();

      String sql = "INSERT INTO Payments (itemId, username) VALUES (?, ?)";
      pstmt = conn.prepareStatement(sql);
      pstmt.setString(1, itemId);
      pstmt.setString(2, username);

      int affectedRows = pstmt.executeUpdate();

      if (affectedRows > 0) {
        response.setStatus(HttpServletResponse.SC_CREATED);
        response
          .getWriter()
          .write("{\"message\": \"Payment processed successfully\"}");
      } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response
          .getWriter()
          .write("{\"message\": \"Failed to process payment\"}");
      }
    } catch (SQLException e) {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      response
        .getWriter()
        .write(
          "{\"message\": \"Error processing payment: " + e.getMessage() + "\"}"
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
