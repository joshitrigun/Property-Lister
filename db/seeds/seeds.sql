
INSERT INTO users (id, name, email, password, phone, is_admin) VALUES
(1, 'Trigun', 'trigun@gmail.com', 'abc', '2347891234', true),
(2, 'Mohammed', 'mohammed@gmail.com', 'abc', '33347891234', true),
(3, 'Michael', 'mike@gmail.com', 'abc', '4047891234', true),
(4, 'Naruto', 'trigun@gmail.com', 'abc', '5127891234', false),
(5, 'harry', 'harry@gmail.com', 'abc', '6047891234', false),
(6, 'carey', 'carey@gmail.com', 'abc', '3237891234', false),
(7, 'Apple', 'apple@gmail.com', 'abc', '6042891234', false),
(8, 'Jack', 'jack@gmail.com', 'abc', '7122891234', false),
(9, 'Kim', 'kim@gmail.com', 'abc', '6044894534', false);

INSERT INTO properties
(owner_id, name, title, description, cost, image_url, number_of_bedrooms, number_of_bathrooms, country, province, city, postal_code, street, isActive, isFeatured) VALUES
(1, 'Richmond Mansion', 'BC Mansion', 'Lorem ipsum dolor sit amet', 2000000, 'https://mediavault.point2.com/p2h/listing/873f/6e2b/0cab/5af3411a8de4a7fa0426/nwm_full.jpg', 10, 16, 'Canada', 'BC', 'Richmond', 'Y6Y5C6', 'Granville', 'true', true),
(1, 'Vancouver Mansion', 'Van Mansion', 'Lorem ipsum dolor sit amet', 4000000, 'https://images.dailyhive.com/20190422151106/Screen-Shot-2019-04-22-at-3.06.53-PM.png', 11, 14, 'Canada', 'BC', 'Vancouver', 'Y6Y5C6', 'A', 'true', true),
(2, 'Calgary Mansion', 'Cal Mansion', 'Lorem ipsum dolor sit amet', 1000000, 'https://www.vmcdn.ca/f/files/via/images/point-grey-0.jpg;w=960', 8, 5, 'Canada', 'BC', 'Cal', 'Y6Y5C6', 'B', 'true', true),
(3, 'Toronto Mansion', 'Tor Mansion', 'Lorem ipsum dolor sit amet', 800000, 'https://i1.wp.com/media.globalnews.ca/videostatic/724/143/1800_DROPPING_HOME_PRIC_BC108I5R_tnb_4.jpg?w=1040&quality=70&strip=all', 9, 9, 'Canada', 'BC', 'Tor', 'Y6Y5C6', 'C', 'true', false),
(4, 'Victoria Mansion', 'Vic Mansion', 'Lorem ipsum dolor sit amet', 1500000, 'https://www.fancypantshomes.com/wp-content/uploads/2020/01/drake-mansion-in-toronto.jpg', 10, 11, 'Canada', 'BC', 'Victoria', 'Y6Y5C6', 'D', 'true', false),
(5, 'Alberta Mansion', 'Alberta Rentals', 'Lorem ipsum dolor sit amet', 1000000, 'https://torontolife.com/wp-content/uploads/2013/10/vaughan-mansion-A001.jpg', 10, 12, 'Canada', 'BC', 'Alberta', 'Y6Y5C6', 'E', 'true', false),
(5, 'Montreal Mansion', 'MnM Mansion', 'Lorem ipsum dolor sit amet', 3000000, 'https://i.ytimg.com/vi/wwockr1Shfs/maxresdefault.jpg',8, 6, 'Canada', 'BC', 'Montreal', 'Y6Y5C6', 'F', 'true', false),
(8, 'Surrey Mansion', 'Surrey Mansion', 'Lorem ipsum dolor sit amet', 900000, 'https://www.mortgage4canadians.ca/siteimages/fort_lauderdale_luxury_homes_750.png',5, 8, 'Canada', 'BC', 'Surrey', 'Y6Y5C6', 'G', 'true', false),
(9, 'Burnaby Mansion', 'Burnaby Housing', 'Lorem ipsum dolor sit amet', 4000000, 'https://images.dailyhive.com/20210219083628/Screen-Shot-2021-02-19-at-11.34.03-AM.png',8, 6, 'Canada', 'BC', 'Burnaby', 'Y6Y5C6', 'H', 'true', false);


INSERT INTO favorites (user_id, property_id)
VALUES (1, 1), (1, 2), (2, 3), (3, 4);

INSERT INTO messages (sender_id, property_id, text)
VALUES (1, 4, 'hi'),(2, 2, 'hello') ;
