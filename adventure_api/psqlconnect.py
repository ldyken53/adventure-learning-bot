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


def database_execute(query: str, args):
    conn = connect_from_env()
    with conn.cursor() as cursor:
        cursor.execute(query, args)
    conn.close()


def database_query(query: str, args):
    conn = connect_from_env()
    with conn.cursor() as cursor:
        cursor.execute(query, args)
        rows = cursor.fetchall()
    conn.close()
    return rows


if __name__ == "__main__":
    print("Testing database connection...")
    database_execute("SELECT * FROM genre;", tuple())
    print("Success!")
