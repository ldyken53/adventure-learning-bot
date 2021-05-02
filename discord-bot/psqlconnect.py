# STD
import os
import logging

# PIP
import psycopg2
from psycopg2.extras import DictCursor


LOG = logging.getLogger(__name__)


def connect_from_env():
    kwargs = {
        "user": os.getenv("PG_USER"),
        "password": os.getenv("PG_PASSWORD"),
        "host": os.getenv("PG_HOST"),
    }
    return psycopg2.connect(**kwargs, cursor_factory=DictCursor)


def database_fetch(query: str, args: tuple) -> list:
    conn = connect_from_env()
    print("Database connection success!")
    with conn.cursor() as curs:
        curs.execute(query, args)
        rows = curs.fetchall()
    conn.close()
    return list(rows)
