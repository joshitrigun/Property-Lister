-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  user_types VARCHAR(255) NOT NULL,
);

CREATE TABLE properties(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER FOREIGN KEY REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  cost VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  number_of_bedrooms VARCHAR(255) NOT NULL,
  number_of_bathrooms VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  postal_code VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  isActive VARCHAR(255) NOT NULL,
);

CREATE TABLE messages (
id SERIAL PRIMARY KEY NOT NULL,
);
CREATE TABLE favorites (
id SERIAL PRIMARY KEY NOT NULL,
);



INSERT INTO movie_villains (villain, movie)
VALUES ('Agent Smith', 'The Matrix'),
  ('Voldemort', 'Harry Potter Series'),
  ('Wicked Witch of the West', 'Wizard of Oz'),
  ('Thanos', 'Avengers');
