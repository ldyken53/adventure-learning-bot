CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS genre (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    emoji varchar(4) DEFAULT '❓',
    name text NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS adventure (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    genre_id uuid REFERENCES genre (id),
    name text NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    creator text NOT NULL,
    created_on timestamp NOT NULL DEFAULT now(),
    paths jsonb NOT NULL
);

INSERT INTO genre (name, emoji, description) VALUES ('math',        '🧮', 'The beautiful abstract structures of the universe.');
INSERT INTO genre (name, emoji, description) VALUES ('science',     '🔬', 'The world''s mysteries, explored one careful question at a time.');
INSERT INTO genre (name, emoji, description) VALUES ('literature',  '📚', 'The wonders of the creative human mind expressed through written word.');
INSERT INTO genre (name, emoji, description) VALUES ('history',     '🌎', 'How did we get here?');
INSERT INTO genre (name, emoji, description) VALUES ('language',    '🗣', 'The expression of thought across generation and culture.');

INSERT INTO adventure (
        genre_id, 
        name, 
        description, 
        creator, 
        paths
    ) 
    VALUES (
        (SELECT id FROM genre WHERE name = 'science'), 
        'Our Solar System', 
        'A guided journey through our neighborhood of space.',
        'Jan Foksinski',
        '{"genre_id": "88ade693-91ab-47c0-9788-c951aba846dd", "name": "Our Solar System", "description": "A guided journey through our neighborhood of space.", "creator": "Jan Foksinski", "paths": {"00000000-0000-0000-0000-000000000000": {"text": "Our journey of the solar system begins with our Sun. Did you know that the Sun is actually a star? The Sun also keeps all of the planets in order using a force called gravity.\nDo you want to:", "embeds": {}, "options": [{"text": "Learn about Gravity", "dest": "b50d423b-bfbc-4641-84ba-c0f7eee9b54e"}, {"text": "Move on to Mercury", "dest": "283fc8eb-3297-4215-a174-021597207484"}]}, "b50d423b-bfbc-4641-84ba-c0f7eee9b54e": {"text": "Gravity is a force that acts on all things that have mass. Me, you, a house; all have mass! Gravity is the reason why, when you jump, you come back down. Without gravity, you would just float off into space if you jumped!\nDo you want to:", "embeds": {}, "options": [{"text": "Go Back to the Sun", "dest": "00000000-0000-0000-0000-000000000000"}, {"text": "Go to Mercury", "dest": "283fc8eb-3297-4215-a174-021597207484"}]}, "283fc8eb-3297-4215-a174-021597207484": {"text": "Mercury is the closest planet to the Sun, and it’s also the fastest! In fact, one year on Mercury is only 88 Earth days! The planet zips around the Sun at about 29 miles per second, that’s 104400 miles per hour! Days on Mercury take a long time to complete. In fact, it takes about 59 Earth days for one day to pass on Mercury!\nDo you want to:", "embeds": {}, "options": [{"text": "Learn about things that go fast", "dest": "fae3029c-cf1c-46d7-9f18-a111eefa5175"}, {"text": "Move on to Venus", "dest": "080dd8bf-df98-4f9c-9ca0-7597c859fc56"}]}, "fae3029c-cf1c-46d7-9f18-a111eefa5175": {"text": "There are many fast things around us. One of the fastest animals in the world is the Cheetah, which can run up to 80 miles per hour! One of the fastest cars that you can buy can hit speeds of over 300 miles per hour! All of these things are slow in comparison to the fastest man made object: The Helios Satellite. The Helios satellite was created to study the Sun by getting closer to it than Mercury is to the Sun. The satellite is also the fastest man-made object that got up to 157,100 miles per hour!\nDo you want to:", "embeds": {}, "options": [{"text": "Go back to Mercury", "dest": "283fc8eb-3297-4215-a174-021597207484"}, {"text": "Go to venus", "dest": "080dd8bf-df98-4f9c-9ca0-7597c859fc56"}]}, "080dd8bf-df98-4f9c-9ca0-7597c859fc56": {"text": "Venus is not the last planet in the solar system, but it''s where this journey ends. Have fun!", "embeds": {}, "options": []}}}'
    ) RETURNING id;