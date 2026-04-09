CREATE TABLE records (
                         id UUID PRIMARY KEY,
                         user_id UUID NOT NULL,
                         type VARCHAR(50),
                         activity VARCHAR(100),
                         value DOUBLE PRECISION,
                         unit VARCHAR(50),
                         carbon_emission DOUBLE PRECISION,
                         created_at TIMESTAMP
);

CREATE INDEX idx_user_id ON records(user_id);