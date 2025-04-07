

CREATE TABLE users(
    id VARCHAR(255) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile VARCHAR(255),
    coverImage VARCHAR(255),
    isActive BIT DEFAULT 0,
    isUpdated BIT DEFAULT 0,
    isDelete BIT DEFAULT 0,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME,
    role VARCHAR(50) DEFAULT 'student'
)

select * from users
