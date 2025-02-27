package server.model;

public class Payment {

  private String itemId;
  private String username;

  public Payment() {}

  public Payment(String itemId, String username) {
    this.itemId = itemId;
    this.username = username;
  }

  public String getItemId() {
    return itemId;
  }

  public void setItemId(String itemId) {
    this.itemId = itemId;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
}
