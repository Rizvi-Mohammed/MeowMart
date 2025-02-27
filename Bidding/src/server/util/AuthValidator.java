package server.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class AuthValidator {

  public static String isUserAuthenticated(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if ("username".equals(cookie.getName()) && cookie.getValue() != null) {
          return cookie.getValue(); // User is authenticated
        }
      }
    }
    return null;
  }
}
