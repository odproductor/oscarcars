-- ============================================================
--  Prueba Oscar - Creacion de la base de datos y tablas
--  Motor: SQL Server
-- ============================================================

IF DB_ID('oscarcars') IS NULL
    CREATE DATABASE oscarcars;
GO

USE oscarcars;
GO

-- ---------- Tabla de usuarios ----------
IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id          BIGINT IDENTITY(1,1) PRIMARY KEY,
        name        NVARCHAR(120) NOT NULL,
        email       NVARCHAR(150) NOT NULL,
        password    NVARCHAR(255) NOT NULL,
        created_at  DATETIME2     NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_users_email UNIQUE (email)
    );
END
GO

-- ---------- Tabla de autos ----------
IF OBJECT_ID('dbo.cars', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.cars (
        id          BIGINT IDENTITY(1,1) PRIMARY KEY,
        brand       NVARCHAR(60)  NOT NULL,
        model       NVARCHAR(60)  NOT NULL,
        model_year  INT           NOT NULL,
        plate       NVARCHAR(15)  NOT NULL,
        color       NVARCHAR(30)  NOT NULL,
        photo_url   NVARCHAR(500) NULL,
        created_at  DATETIME2     NOT NULL CONSTRAINT DF_cars_created_at DEFAULT SYSUTCDATETIME(),
        user_id     BIGINT        NOT NULL,
        CONSTRAINT FK_cars_user FOREIGN KEY (user_id)
            REFERENCES dbo.users (id) ON DELETE CASCADE
    );

    CREATE INDEX IX_cars_user_id ON dbo.cars (user_id);
END
GO
