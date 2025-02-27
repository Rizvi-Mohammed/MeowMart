
-- SQL File to Insert Dummy Data into Cats Table

-- Create the Cats table if it doesn't already exist
CREATE TABLE IF NOT EXISTS Cats (
    itemID INTEGER PRIMARY KEY AUTOINCREMENT,
    itemName TEXT NOT NULL,
    auctionType TEXT CHECK(auctionType IN ('forward', 'dutch')) NOT NULL,
    startingPrice REAL NOT NULL,
    reservePrice REAL NOT NULL,
    username TEXT,
    catBreed TEXT,
    age INTEGER
);

-- Insert Dummy Data
INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Fluffy', 'forward', 100.00, 150.00, NULL, 'Persian', 2);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Whiskers', 'dutch', 200.00, 120.00, NULL, 'Maine Coon', 4);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Shadow', 'forward', 80.00, 100.00, NULL, 'Siamese', 3);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Mittens', 'dutch', 150.00, 90.00, NULL, 'Bengal', 1);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Tiger', 'forward', 300.00, 350.00, NULL, 'Savannah', 5);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Simba', 'dutch', 120.00, 100.00, NULL, 'Abyssinian', 2);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Snowball', 'forward', 110.00, 140.00, NULL, 'Ragdoll', 4);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Smudge', 'dutch', 250.00, 130.00, NULL, 'Scottish Fold', 3);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Cleo', 'forward', 90.00, 100.00, NULL, 'Sphynx', 2);

INSERT INTO Cats (itemName, auctionType, startingPrice, reservePrice, username, catBreed, age) 
VALUES ('Luna', 'dutch', 180.00, 150.00, NULL, 'British Shorthair', 4);
