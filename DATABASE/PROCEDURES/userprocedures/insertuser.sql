CREATE OR ALTER PROCEDURE insertUser(
 @id VARCHAR(100),
 @username VARCHAR(100),
 @email VARCHAR(100),
 @password VARCHAR(100)
)
AS
BEGIN
  INSERT INTO USERDB(
  id,
  username,
  email,
  password
  )
  VALUES(
   @id,
   @username,
   @email,
   @password
  )

END