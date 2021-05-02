# STL
import os
import json
import logging

# PDM
import flask_cors
from flask import Flask, jsonify, request
from flask_cors.decorator import cross_origin
import psycopg2
from psycopg2.extras import DictCursor

app = Flask(__name__)
flask_cors.CORS(app)

debug = False

logging.getLogger("flask_cors").level = logging.DEBUG
logging.getLogger().level = logging.DEBUG
logging.getLogger(__name__).level = logging.DEBUG

LOG = logging.getLogger(__name__)
LOG.error("Initialized logger")


@app.before_request
def before_request():
    LOG.debug("Debug test")
    LOG.info("Info test")
    LOG.warning("Warning test")
    LOG.error("Error test")


def connect_from_env():
    kwargs = {
        "user": os.getenv("PG_USER"),
        "password": os.getenv("PG_PASSWORD"),
        "host": os.getenv("PG_HOST"),
    }
    conn = psycopg2.connect(**kwargs, cursor_factory=DictCursor)
    conn.autocommit = True
    return conn


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


@app.after_request
def after_request(response):
    header = response.headers
    header["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/test")
def test():
    return "Yes, we're here.", 200


@app.route("/get-genres")
@cross_origin()
def get_genres():
    records = database_query("SELECT * FROM genre;", tuple())
    return jsonify([{**record} for record in records])


@app.route("/get-adventures")
@cross_origin()
def get_adventures():
    records = database_query("SELECT * FROM adventure;", tuple())
    return jsonify([{**record} for record in records])


@app.route("/add-adventure", methods=["POST"])
@cross_origin()
def add_adventure():
    LOG.warning("/add-adventure called")
    genre_id = request.json.get("genre_id")
    name = request.json.get("name")
    description = request.json.get("description")
    creator = request.json.get("creator") or "Anonymous"
    paths = request.json.get("paths")

    query = """
    INSERT INTO adventure (
        genre_id, 
        name, 
        description, 
        creator, 
        paths
    ) 
    VALUES (
        %s, 
        %s, 
        %s,
        %s,
        %s
    ) RETURNING id;
    """

    records = database_query(
        query, (genre_id, name, description, creator, json.dumps(paths))
    )

    return str(records[0]), 200


if __name__ == "__main__":
    debug = True
    app.run(debug=debug, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
