-- Clear existing items
DELETE FROM items;

-- Reset auto-increment
DELETE FROM sqlite_sequence WHERE name='items';

-- Insert seed data
INSERT INTO items (itemName, auctionType, startingPrice, reservePrice) VALUES
('Vintage Leather Jacket', 'highest', 1000.00, 0.00),
('Nintendo Switch OLED', 'highest', 1500.00, 0.00),
('MacBook Pro M2', 'dutch', 2000.00, 1000.00),
('Diamond Engagement Ring', 'dutch', 2500.00, 1200.00),
('Rare Comic Book Collection', 'highest', 3000.00, 0.00),
('Professional Camera Kit', 'dutch', 3500.00, 2000.00),
('Antique Pocket Watch', 'highest', 4000.00, 0.00),
('Gaming PC Setup', 'dutch', 4500.00, 2500.00),
('First Edition Book Set', 'highest', 5000.00, 0.00),
('Electric Guitar Bundle', 'dutch', 5500.00, 3000.00),
('Luxury Handbag', 'highest', 2200.00, 0.00),
('iPhone 15 Pro Max', 'dutch', 1800.00, 1000.00),
('Vintage Record Collection', 'highest', 1200.00, 0.00),
('Smart Home Bundle', 'dutch', 3200.00, 1800.00),
('Sports Memorabilia Set', 'highest', 2800.00, 0.00),
('Designer Sunglasses', 'dutch', 800.00, 400.00),
('Handmade Persian Rug', 'highest', 6000.00, 0.00),
('Limited Edition Sneakers', 'dutch', 1500.00, 800.00),
('Drone with 4K Camera', 'highest', 1800.00, 0.00),
('Premium Coffee Machine', 'dutch', 2400.00, 1200.00);
