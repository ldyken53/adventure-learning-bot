# STL
import os

# PDM
from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import DictCursor

app = Flask(__name__)

debug = False


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


@app.after_request
def after_request(response):
    header = response.headers
    header["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/test")
def test():
    return "Yes, we're here.", 200


@app.route("/get-genres")
def get_genres():
    records = database_query("SELECT * FROM genre;", tuple())
    return jsonify([{**record} for record in records])


@app.route("/get-adventures")
def get_adventures():
    records = database_query("SELECT * FROM adventure;", tuple())
    return jsonify([{**record} for record in records])


@app.route("/add-adventure", methods=["POST"])
def add_adventure():
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
        '$1'::uuid, 
        '$2', 
        '$3',
        '$4',
        $5
    ) RETURNING id;
    """

    records = database_query(query, (genre_id, name, description, creator, paths))

    return str(records[0]), 200


if __name__ == "__main__":
    debug = True
    app.run(debug=debug, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
