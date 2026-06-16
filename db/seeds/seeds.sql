-- Seed users. All seed accounts share the password "password".
-- The value below is a bcrypt hash of "password" (cost 10).
INSERT INTO users (id, name, email, password, phone, is_admin) VALUES
(1, 'Trigun', 'trigun@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '2347891234', true),
(2, 'Mohammed', 'mohammed@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '33347891234', true),
(3, 'Michael', 'mike@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '4047891234', true),
(4, 'Naruto', 'naruto@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '5127891234', false),
(5, 'harry', 'harry@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '6047891234', false),
(6, 'carey', 'carey@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '3237891234', false),
(7, 'Apple', 'apple@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '6042891234', false),
(8, 'Jack', 'jack@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '7122891234', false),
(9, 'Kim', 'kim@gmail.com', '$2b$10$eGgKyiF0U4KdiLLJ0c4yQehoFSbuuXI0UxEc68QGsonCZNtF6Oftq', '6044894534', false);

-- Keep the users sequence in sync with the explicit ids inserted above.
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

INSERT INTO properties
(owner_id, name, title, description, cost, image_url, number_of_bedrooms, number_of_bathrooms, square_feet, property_type, neighbourhood, country, province, city, postal_code, street, latitude, longitude, isActive, isFeatured) VALUES
(1, 'Richmond Mansion', 'BC Mansion', 'Stunning luxury estate with panoramic views and modern finishes throughout.', 2000000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 10, 16, 5200, 'House', 'Steveston', 'Canada', 'BC', 'Richmond', 'V7E 2J1', 'Granville', 49.1278, -123.1839, true, true),
(1, 'Vancouver Mansion', 'Van Mansion', 'Breathtaking waterfront property in the heart of Vancouver with a private dock.', 4000000, 'https://images.dailyhive.com/20190422151106/Screen-Shot-2019-04-22-at-3.06.53-PM.png', 11, 14, 7100, 'House', 'West End', 'Canada', 'BC', 'Vancouver', 'V6G 1A1', 'Beach Ave', 49.2827, -123.1207, true, true),
(2, 'Calgary Mansion', 'Cal Mansion', 'Elegant estate on a quiet cul-de-sac with a chef kitchen and home theatre.', 1000000, 'https://www.vmcdn.ca/f/files/via/images/point-grey-0.jpg;w=960', 8, 5, 4100, 'House', 'Mount Royal', 'Canada', 'AB', 'Calgary', 'T2S 0J9', 'Prospect Ave SW', 51.0375, -114.0721, true, true),
(3, 'Toronto Mansion', 'Tor Mansion', 'Classic Forest Hill residence with original hardwood floors and a lush garden.', 800000, 'https://i1.wp.com/media.globalnews.ca/videostatic/724/143/1800_DROPPING_HOME_PRIC_BC108I5R_tnb_4.jpg?w=1040&quality=70&strip=all', 9, 9, 3600, 'House', 'Forest Hill', 'Canada', 'ON', 'Toronto', 'M5P 1K8', 'Russell Hill Rd', 43.6894, -79.4049, true, false),
(4, 'Victoria Mansion', 'Vic Mansion', 'Heritage-style mansion steps from the ocean in Victoria''s coveted James Bay area.', 1500000, 'https://www.fancypantshomes.com/wp-content/uploads/2020/01/drake-mansion-in-toronto.jpg', 10, 11, 4600, 'House', 'James Bay', 'Canada', 'BC', 'Victoria', 'V8V 1Y5', 'Dallas Rd', 48.4219, -123.3693, true, false),
(5, 'Alberta Condo', 'Alberta Rentals', 'Modern high-rise condo with floor-to-ceiling windows and a rooftop terrace.', 1000000, 'https://torontolife.com/wp-content/uploads/2013/10/vaughan-mansion-A001.jpg', 3, 2, 1400, 'Condo', 'Glenora', 'Canada', 'AB', 'Edmonton', 'T5N 1B3', '102 Ave NW', 53.5461, -113.4938, true, false),
(5, 'Montreal Condo', 'MnM Mansion', 'Stylish Plateau loft with exposed brick, high ceilings, and courtyard access.', 3000000, 'https://i.ytimg.com/vi/wwockr1Shfs/maxresdefault.jpg', 4, 3, 2600, 'Condo', 'Plateau-Mont-Royal', 'Canada', 'QC', 'Montreal', 'H2W 1V1', 'Avenue du Mont-Royal', 45.5231, -73.5817, true, false),
(8, 'Surrey Townhouse', 'Surrey Mansion', 'Contemporary townhouse in a gated community with a private garage and yard.', 900000, 'https://www.mortgage4canadians.ca/siteimages/fort_lauderdale_luxury_homes_750.png', 4, 3, 2100, 'Townhouse', 'Fleetwood', 'Canada', 'BC', 'Surrey', 'V3S 3K2', '88 Ave', 49.1443, -122.7989, true, false),
(9, 'Burnaby Townhouse', 'Burnaby Housing', 'Spacious end-unit townhouse near Metrotown with updated kitchen and patio.', 4000000, 'https://images.dailyhive.com/20210219083628/Screen-Shot-2021-02-19-at-11.34.03-AM.png', 5, 4, 3100, 'Townhouse', 'Metrotown', 'Canada', 'BC', 'Burnaby', 'V5H 1R2', 'Royal Oak Ave', 49.2276, -122.9998, true, false);

-- Keep the properties sequence in sync.
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));


INSERT INTO favorites (user_id, property_id)
VALUES (1, 1), (1, 2), (2, 3), (3, 4);

INSERT INTO messages (sender_id, property_id, text)
VALUES (1, 4, 'hi'),(2, 2, 'hello') ;

-- Extra gallery images per property (sort_order 1+ = secondary slides)
INSERT INTO property_images (property_id, image_url, sort_order) VALUES
-- Richmond Mansion (id 1)
(1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop', 1),
(1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop', 2),
(1, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&auto=format&fit=crop', 3),
-- Vancouver Mansion (id 2)
(2, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop', 1),
(2, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop', 2),
-- Calgary Mansion (id 3)
(3, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&auto=format&fit=crop', 1),
(3, 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&auto=format&fit=crop', 2),
-- Toronto Mansion (id 4)
(4, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&auto=format&fit=crop', 1),
(4, 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&auto=format&fit=crop', 2),
-- Victoria Mansion (id 5)
(5, 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&auto=format&fit=crop', 1),
(5, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop', 2),
-- Surrey Townhouse (id 8)
(8, 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&auto=format&fit=crop', 1),
-- Burnaby Townhouse (id 9)
(9, 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=900&auto=format&fit=crop', 1);
