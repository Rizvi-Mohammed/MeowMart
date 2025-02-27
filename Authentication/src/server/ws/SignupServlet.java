package server.ws;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;
  String DB_URL = "";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);
    ServletContext context = config.getServletContext();
    String dbPath = context.getRealPath("/WEB-INF/users.db");
    DB_URL = "jdbc:sqlite:" + dbPath;

    // Check if the database file exists
    File dbFile = new File(dbPath);
    System.out.println("Database Path: " + dbPath);
    System.out.println("Database exists: " + dbFile.exists());

    try {
      // Ensure the SQLite driver is loaded
      Class.forName("org.sqlite.JDBC");
    } catch (ClassNotFoundException e) {
      throw new ServletException("SQLite JDBC driver not found", e);
    }

    if (!dbFile.exists()) {
      System.out.println("Database file does not exist, creating new one");
      try (
        Connection conn = DriverManager.getConnection(DB_URL);
        Statement stmt = conn.createStatement()
      ) {
        String sql =
          "CREATE TABLE users (" +
          "username TEXT PRIMARY KEY NOT NULL," +
          "email TEXT NOT NULL," +
          "password TEXT NOT NULL" +
          ")";
        stmt.executeUpdate(sql);
        System.out.println("Created new database and users table");
      } catch (SQLException e) {
        throw new ServletException("Failed to create database", e);
      }
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
    resp.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    resp.setHeader("Access-Control-Allow-Credentials", "true");
  }

  protected void doPost(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws ServletException, IOException {
    System.out.println("SignupServlet: doPost method started");
    setAccessControlHeaders(response);

    String username = request.getParameter("username");
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    System.out.println(
      "SignupServlet: username=" +
      username +
      ", email=" +
      email +
      ", password=" +
      password
    );

    if (
      username == null ||
      email == null ||
      password == null ||
      username.isEmpty() ||
      email.isEmpty() ||
      password.isEmpty()
    ) {
      response
        .getWriter()
        .write("Error: Username, email, and password are required!");
      return;
    }
    System.out.println("SignupServlet: Calling createUser method");
    if (createUser(username, email, password)) {
      response.setContentType("text/plain");
      response.getWriter().write("Signup successful");
    } else {
      response
        .getWriter()
        .write("Error: Username already exists or registration failed.");
    }
  }

  private boolean createUser(String username, String email, String password) {
    System.out.println("SignupServlet: createUser method started");
    try (Connection conn = DriverManager.getConnection(DB_URL)) {
      System.out.println("SignupServlet: Connection valid: " + conn.isValid(5));
      try (
        PreparedStatement stmt = conn.prepareStatement(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        )
      ) {
        stmt.setString(1, username);
        stmt.setString(2, email);
        stmt.setString(3, password);
        int rowsAffected = stmt.executeUpdate();
        System.out.println(
          "SignupServlet: User created successfully, rows affected: " +
          rowsAffected
        );
        return true;
      }
    } catch (SQLException e) {
      System.out.println("\nSomething bad happened\n" + e.getMessage() + "\n");
      e.printStackTrace();
      System.out.println("SignupServlet: User creation failed");
      return false;
    } catch (Exception e) {
      System.out.println("\nSomething bad happened\n" + e.getMessage() + "\n");
      e.printStackTrace();
      System.out.println("SignupServlet: JDBC Driver not found");
      return false;
    }
  }
}
