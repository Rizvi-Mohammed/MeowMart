package server.ws;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;
  String DB_URL = "";

  @Override
  public void init(ServletConfig config) throws ServletException {
    super.init(config);
    ServletContext context = config.getServletContext();
    String dbPath = context.getRealPath("/WEB-INF/users.db"); // Locate users.db within WEB-INF
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
    setAccessControlHeaders(response);

    String username = request.getParameter("username");
    String password = request.getParameter("password");

    System.out.println("Username: " + username);
    System.out.println("Password: " + password);

    if (
      username == null ||
      password == null ||
      username.isEmpty() ||
      password.isEmpty()
    ) {
      response.getWriter().write("Error: Username and password are required!");
      return;
    }

    if (validateUser(username, password)) {
      Cookie loginCookie = new Cookie("username", username);
      loginCookie.setMaxAge(3600); // 1-hour expiry
      loginCookie.setPath("/"); // for the domain
      response.addCookie(loginCookie);

      // Return success message instead of redirect for Next.js frontend
      response.getWriter().write("Login successful");
    } else {
      response.getWriter().write("Invalid username or password!");
    }
  }

  private boolean validateUser(String username, String password) {
    try (Connection conn = DriverManager.getConnection(DB_URL)) {
      try (
        PreparedStatement stmt = conn.prepareStatement(
          "SELECT * FROM users WHERE username = ? AND password = ?"
        )
      ) {
        stmt.setString(1, username);
        stmt.setString(2, password);

        try (ResultSet rs = stmt.executeQuery()) {
          return rs.next();
        }
      }
    } catch (Exception e) {
      System.out.println(
        "\n\n\nSomething bad happened\n\n\n\n" + e.getMessage() + "\n\n\n\n"
      );
      e.printStackTrace();
      return false;
    }
  }
}
