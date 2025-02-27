package server.model;

public class Item {

  private int itemId;
  private String itemName;
  private String auctionType;
  private double startingPrice;
  private double reservePrice;
  private String username;
  private String catBreed;
  private int age;

  // Updated Constructor
  public Item(
    int itemId,
    String itemName,
    String auctionType,
    double startingPrice,
    double reservePrice,
    String username,
    String catBreed,
    int age
  ) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.auctionType = auctionType;
    this.startingPrice = startingPrice;
    this.reservePrice = reservePrice;
    this.username = username;
    this.catBreed = catBreed;
    this.age = age;
  }

  // Getters for all fields
  public int getItemId() {
    return itemId;
  }

  public String getItemName() {
    return itemName;
  }

  public String getAuctionType() {
    return auctionType;
  }

  public double getStartingPrice() {
    return startingPrice;
  }

  public double getReservePrice() {
    return reservePrice;
  }

  public String getUsername() {
    return username;
  }

  public String getCatBreed() {
    return catBreed;
  }

  public int getAge() {
    return age;
  }

  // toString method for debugging purposes
  @Override
  public String toString() {
    return (
      "Item{" +
      "itemId=" +
      itemId +
      ", itemName='" +
      itemName +
      '\'' +
      ", auctionType='" +
      auctionType +
      '\'' +
      ", startingPrice=" +
      startingPrice +
      ", reservePrice=" +
      reservePrice +
      ", username='" +
      username +
      '\'' +
      ", catBreed='" +
      catBreed +
      '\'' +
      ", age=" +
      age +
      '}'
    );
  }
}
