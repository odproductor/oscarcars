-- ============================================================
--  Prueba Oscar - Datos de ejemplo (opcional)
--  Usuario demo:  oscardiaz@oscarcars.com  /  123456
-- ============================================================

USE oscarcars;
GO

-- Usuario demo (la contrasena esta hasheada con BCrypt -> "123456")
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = 'oscardiaz@oscarcars.com')
BEGIN
    INSERT INTO dbo.users (name, email, password)
    VALUES (
        N'Oscar Diaz',
        N'oscardiaz@oscarcars.com',
        N'$2y$10$Cs4moJnUaSFSuVVB82XVkuNfnk1nldvpfN5B1VxtogQCMrfWBMI7q'
    );
END
GO

-- Autos del usuario demo (solo si todavia no tiene)
DECLARE @uid BIGINT = (SELECT id FROM dbo.users WHERE email = 'oscardiaz@oscarcars.com');

IF @uid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.cars WHERE user_id = @uid)
BEGIN
    INSERT INTO dbo.cars (brand, model, model_year, plate, color, photo_url, user_id) VALUES
        (N'Toyota',    N'Corolla', 2020, N'ABC-123', N'Rojo',  NULL, @uid),
        (N'Honda',     N'Civic',   2019, N'XYZ-789', N'Gris',  NULL, @uid),
        (N'Mazda',     N'CX-5',    2022, N'MNB-456', N'Azul',  NULL, @uid),
        (N'Chevrolet', N'Onix',    2023, N'JKL-321', N'Negro', NULL, @uid);
END
GO
