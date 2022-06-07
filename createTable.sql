CREATE TABLE rw_badbank_table_01 (
    id serial NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    balance real NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
)