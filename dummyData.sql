INSERT INTO movies (id,title, genre, release_date)
VALUES (1,'matrix', 'scify', '1999');
INSERT INTO movies (id,title, genre, release_date)
VALUES (2,'starwars', 'scify', '1989');


INSERT INTO users (id,username, password)
VALUES (1,'krishan', '12345');
INSERT INTO users (id,username, password)
VALUES (2,'ling', '12345');
INSERT INTO users (id,username, password)
VALUES (3,'justin', '12345');


INSERT INTO ratings (userid,movieid,score)
VALUES (1, 1, 5.5);
INSERT INTO ratings (userid,movieid,score)
VALUES (1, 2, 3);
INSERT INTO ratings (userid,movieid,score)
VALUES (2, 1, 10);
INSERT INTO ratings (userid,movieid,score)
VALUES (2, 2, 4.23423);
INSERT INTO ratings (userid,movieid,score)
VALUES (3, 1, 1);
INSERT INTO ratings (userid,movieid,score)
VALUES (3, 2, 8.238746);


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


