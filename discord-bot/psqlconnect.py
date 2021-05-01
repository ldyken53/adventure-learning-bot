# STD
import os
import logging

# PIP
import psycopg2
from psycopg2.extras import DictCursor


LOG = logging.getLogger(__name__)


def connect_from_env():
    kwargs = dict()

    kwargs["username"] = os.getenv("PG_USER")
    kwargs["password"] = os.getenv("PG_USER")
    kwargs["host"] = os.getenv("PG_HOST")

    return psycopg2.connect(**kwargs, cursor_factory=DictCursor)



def database_execute(query: str):
    LOG.info("starting connection")
    conn = connect_from_env()
    LOG.info("connetion established")
    conn.close()

database_execute("something")
    



