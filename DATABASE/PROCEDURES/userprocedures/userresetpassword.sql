CREATE PROCEDURE ResetPassword
  @Email nvarchar(50),
  @NewPassword nvarchar(50)
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE Users
  SET Password = @NewPassword
  WHERE Email = @Email

  IF @@ROWCOUNT = 0
    RETURN 0;
  ELSE
    RETURN 1;
END
