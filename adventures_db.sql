CREATE TABLE IF NOT EXISTS adventures (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    creator text NOT NULL,
    created_on timestamp NOT NULL DEFAULT now(),
    paths jsonb NOT NULL
);