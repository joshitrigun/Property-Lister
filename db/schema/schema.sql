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
  is_admin BOOLEAN
);



CREATE TABLE properties(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id),
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
  isFeatured BOOLEAN

);


CREATE TABLE favorites (
id SERIAL PRIMARY KEY NOT NULL,
user_id INTEGER  REFERENCES users(id),
property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE messages (
id SERIAL PRIMARY KEY NOT NULL,
sender_id INTEGER  REFERENCES users(id),
receiver_key INTEGER  REFERENCES users(id),
property_id INTEGER  REFERENCES properties(id) ON DELETE CASCADE,
text VARCHAR(255)
);

