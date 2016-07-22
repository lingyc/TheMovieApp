
INSERT INTO movies (id, title, genre, release_date, imdbRating, description, poster)
VALUES (1,'matrix', 'scify', '1999', 10, 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.','http://www.imagozone.com/var/albums/filme/The%20Matrix/The%20Matrix009.jpg?m=1292987658');
INSERT INTO movies (id, title, genre, release_date, imdbRating, description, poster)
VALUES (2,'starwars', 'scify', '1989', 12, 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a wookiee and two droids to save the galaxy from the Empire world-destroying battle-station, while also attempting to rescue Princess Leia from the evil Darth Vader.', 'http://i.kinja-img.com/gawker-media/image/upload/s---zKMfGT0--/c_scale,fl_progressive,q_80,w_800/19fk32sw3nt1wjpg.jpg');


INSERT INTO users (id,username, password, firstName, lastName, email)
VALUES (1,'krishan', '12345', 'Krishan', 'Ayra', 'krishan@gmail.com');
INSERT INTO users (id,username, password, firstName, lastName, email)
VALUES (2,'ling', '12345', 'Ling', 'Chen', 'ling@gmail.com');
INSERT INTO users (id,username, password, firstName, lastName, email)
VALUES (3,'justin', '12345', 'Justin', 'Ou', 'justin@gmail.com');


INSERT INTO ratings (score,movieid,userid,review)
VALUES (5.5, 1, 1, 'pretty good');
INSERT INTO ratings (score,movieid,userid,review)
VALUES (3, 2, 1, 'pretty okay');
INSERT INTO ratings (score,movieid,userid,review)
VALUES (10, 1, 2, 'fun');
INSERT INTO ratings (score,movieid,userid,review)
VALUES (4.2, 2, 2, 'good movie');
INSERT INTO ratings (score,movieid,userid,review)
VALUES (1, 1, 3, 'classic');
INSERT INTO ratings (score,movieid,userid,review)
VALUES (8.2, 2, 3, 'alright');


INSERT INTO relations (user1id,user2id)
VALUES (1, 2);
INSERT INTO relations (user1id,user2id)
VALUES (2, 1);
INSERT INTO relations (user1id,user2id)
VALUES (1, 3);
INSERT INTO relations (user1id,user2id)
VALUES (3, 1);
INSERT INTO relations (user1id,user2id)
VALUES (2, 3);
INSERT INTO relations (user1id,user2id)
VALUES (3, 2);

-- INSERT INTO friendRequests (requestor,requestee)
-- VALUES (1, 2);
-- INSERT INTO friendRequests (requestor,requestee)
-- VALUES (1, 3);
-- INSERT INTO friendRequests (requestor,requestee)
-- VALUES (2, 3);

