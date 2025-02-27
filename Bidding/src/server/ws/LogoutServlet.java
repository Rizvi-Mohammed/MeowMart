package server.ws;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
		Cookie loginCookie = new Cookie("username", null);
		loginCookie.setMaxAge(0); // Deletes the cookie
		loginCookie.setPath("/"); // Match the cookie path
		response.addCookie(loginCookie);

		// Redirect to the login page
        response.sendRedirect("http://localhost:8080/Authentication/Auth.jsp");
    }
}
