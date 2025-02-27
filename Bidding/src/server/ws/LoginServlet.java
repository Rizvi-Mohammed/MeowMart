package server.ws;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;

  /**
   * @see HttpServlet#HttpServlet()
   */
  public LoginServlet() {
    super();
    // TODO Auto-generated constructor stub
  }

  /**
   * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  protected void doGet(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws ServletException, IOException {
    // TODO Auto-generated method stub
    response.setContentType("text/html");
    HttpSession session = request.getSession();
    String user = (String) session.getAttribute("authenticatedUser");
    System.out.println(user);
    String target = "/WSC.jsp";

    String checkedName = request.getParameter("checked");
    session.setAttribute("fchecked", checkedName);
    if (session.getAttribute("firstTime") == null) session.setAttribute(
      "firstTime",
      1
    );

    if (user != null) {
      request.getRequestDispatcher(target).forward(request, response);
      session.setAttribute("firstTime", null);
    }
  }

  /**
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
   *      response)
   */
  protected void doPost(
    HttpServletRequest request,
    HttpServletResponse response
  ) throws ServletException, IOException {
    // TODO Auto-generated method stub
    doGet(request, response);
  }
}
