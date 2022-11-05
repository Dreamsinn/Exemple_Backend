ALTER TABLE todo ADD COLUMN create_at timestamp NOT NULL DEFAULT now();
ALTER TABLE todo ADD COLUMN update_at timestamp;