CREATE TABLE IF NOT EXISTS adventures (
    creator text NOT NULL,
    created_on timestamp NOT NULL DEFAULT now(),
    paths jsonb NOT NULL
);