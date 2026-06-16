-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS saved_searches CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
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
  square_feet INTEGER,
  property_type VARCHAR(50) NOT NULL DEFAULT 'House',
  neighbourhood VARCHAR(255),
  country VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  postal_code VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  isActive BOOLEAN DEFAULT true,
  isFeatured BOOLEAN DEFAULT false
);

CREATE INDEX properties_type_idx ON properties(property_type);
CREATE INDEX properties_city_idx ON properties(city);
CREATE INDEX properties_neighbourhood_idx ON properties(neighbourhood);


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

CREATE TABLE property_images (
  id SERIAL PRIMARY KEY NOT NULL,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url VARCHAR(512) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE saved_searches (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  query_params TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX saved_searches_user_id_idx ON saved_searches(user_id);

CREATE INDEX properties_owner_id_idx ON properties(owner_id);
CREATE INDEX properties_cost_idx ON properties(cost);
CREATE UNIQUE INDEX favorites_user_property_idx ON favorites(user_id, property_id);
CREATE INDEX favorites_property_id_idx ON favorites(property_id);
CREATE INDEX messages_property_id_idx ON messages(property_id);
CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX property_images_property_id_idx ON property_images(property_id);

