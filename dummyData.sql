-- mysql -u root -p

INSERT INTO movies (id, title, genre, release_date, poster)
VALUES (1,'matrix', 'scify', '1999', 'http://www.imagozone.com/var/albums/filme/The%20Matrix/The%20Matrix009.jpg?m=1292987658');
INSERT INTO movies (id, title, genre, release_date, poster)
VALUES (2,'starwars', 'scify', '1989', 'http://i.kinja-img.com/gawker-media/image/upload/s---zKMfGT0--/c_scale,fl_progressive,q_80,w_800/19fk32sw3nt1wjpg.jpg');


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

