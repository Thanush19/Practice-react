CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- Automatically incrementing unique ID
  username VARCHAR(255) NOT NULL UNIQUE,  -- Username should be unique and not null
  email VARCHAR(255) NOT NULL UNIQUE,  -- Email should be unique and not null
  password VARCHAR(255) NOT NULL,  -- Password field (can store hashed password)
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'supervisor', 'deliveryPartner')),  -- Role must be one of these three
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the record is created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when the record is updated
);
