DROP TABLE IF EXISTS person_hobbies;
DROP TABLE IF EXISTS hobbies;
DROP TABLE IF EXISTS people;

CREATE TABLE people (
  id              INTEGER PRIMARY KEY,
  avatar          TEXT    NOT NULL,
  first_name      TEXT    NOT NULL,
  last_name       TEXT    NOT NULL,
  first_name_norm TEXT    NOT NULL,
  last_name_norm  TEXT    NOT NULL,
  age             INTEGER NOT NULL CHECK (age BETWEEN 0 AND 120),
  nationality     TEXT    NOT NULL
);

CREATE TABLE hobbies (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE person_hobbies (
  person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  hobby_id  INTEGER NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  PRIMARY KEY (person_id, hobby_id)
);

CREATE INDEX idx_people_first_name  ON people(first_name_norm, id);
CREATE INDEX idx_people_last_name   ON people(last_name_norm, id);
CREATE INDEX idx_people_age         ON people(age, id);
CREATE INDEX idx_people_nationality ON people(nationality, id);
CREATE INDEX idx_person_hobbies_hobby ON person_hobbies(hobby_id, person_id);
