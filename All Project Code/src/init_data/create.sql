DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(60) PRIMARY KEY NOT NULL
  username VARCHAR(50)  NOT NULL,
  password VARCHAR(60) NOT NULL,
);