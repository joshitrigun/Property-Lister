-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  is_admin BOOLEAN,
);


CREATE TABLE properties(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER FOREIGN KEY REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  cost INTEGER,
  image_url VARCHAR(255) NOT NULL,
  number_of_bedrooms INTEGER,
  number_of_bathrooms INTEGER,
  country VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  postal_code VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  isActive BOOLEAN,
);


CREATE TABLE favorites (
id SERIAL PRIMARY KEY NOT NULL,
user_id INTEGER FOREIGN KEY REFERENCES users(id),
property_id INTEGER FOREIGN KEY REFERENCES properties(id)
);
CREATE TABLE messages (
id SERIAL PRIMARY KEY NOT NULL,
sender_id INTEGER FOREIGN KEY REFERENCES favorites(id),
receiver_key INTEGER FOREIGN KEY REFERENCES favorites(id),
property_id INTEGER FOREIGN KEY REFERENCES properties(id),
text VARCHAR(255)
);


INSERT INTO users (name, email, password, phone, is_admin) VALUES
('Trigun', 'trigun@gmail.com', 'abc', '2347891234', 'true'),
('Mohammed', 'mohammed@gmail.com', 'abc', '33347891234', 'true'),
('Michael', 'mike@gmail.com', 'abc', '4047891234', 'true'),
('Naruto', 'trigun@gmail.com', 'abc', '5127891234', 'false'),
('harry', 'harry@gmail.com', 'abc', '6047891234', 'false'),
('carey', 'carey@gmail.com', 'abc', '3237891234', 'false'),
('Apple', 'apple@gmail.com', 'abc', '6042891234', 'false'),
('Jack', 'jack@gmail.com', 'abc', '7122891234', 'false'),
('Kim', 'kim@gmail.com', 'abc', '6044894534', 'false');

INSERT INTO properties
(name, title, description, cost, image_url, number_of_bedrooms, number_of_bathrooms, country, province, city, postal_code, street, is_active) VALUES
('Richmond Mansion', 'BC Mansion', 'Lorem ipsum dolor sit amet', 2000000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 10, 16, 'Canada', 'BC', 'Richmond', 'Y6Y5C6', 'Granville', true),
('Vancouver Mansion', 'Van Mansion', 'Lorem ipsum dolor sit amet', 4000000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 11, 14, 'Canada', 'BC', 'Vancouver', 'Y6Y5C6', 'A', true),
('Calgary Mansion', 'Cal Mansion', 'Lorem ipsum dolor sit amet', 100000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 8, 5, 'Canada', 'BC', 'Cal', 'Y6Y5C6', 'B', true),
('Toronto Mansion', 'Tor Mansion', 'Lorem ipsum dolor sit amet', 800000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 9, 9, 'Canada', 'BC', 'Tor', 'Y6Y5C6', 'C', true),
('Victoria Mansion', 'Vic Mansion', 'Lorem ipsum dolor sit amet', 1500000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 10, 11, 'Canada', 'BC', 'Victoria', 'Y6Y5C6', 'D', true),
('Alberta Mansion', 'Alberta Rentals', 'Lorem ipsum dolor sit amet', 1000000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 10, 12, 'Canada', 'BC', 'Alberta', 'Y6Y5C6', 'E', true),
('Montreal Mansion', 'MnM Mansion', 'Lorem ipsum dolor sit amet', 900000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg',8, 6, 'Canada', 'BC', 'Montreal', 'Y6Y5C6', 'F', true),
('Surrey Mansion', 'Surrey Mansion', 'Lorem ipsum dolor sit amet', 600000, "https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg",5, 8, 'Canada', 'BC', 'Surrey', 'Y6Y5C6', 'G', true),
('Burnaby Mansion', 'Burnaby Housing', 'Lorem ipsum dolor sit amet', 900000, "https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg",8, 6, 'Canada', 'BC', 'Burnaby', 'Y6Y5C6', 'H', true);

