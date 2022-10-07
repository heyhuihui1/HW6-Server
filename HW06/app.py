from flask import Flask, jsonify, abort, request, Response
import json
from api import *

app = Flask(__name__, static_folder='static')


@app.route('/')
@app.route('/index.html')
def index():
    return app.send_static_file('index.html')


@app.route("/api/business_search", methods = ["GET"])
def business_search():
    params = request.full_path.split("?")[1].split("&")
    print(params)
    json_params = {
        'term': params[0].split("=")[1],
        'radius': int(params[1].split("=")[1]),
        'categories': params[2].split("=")[1],
        'latitude': float(params[3].split("=")[1]),
        'longitude': float(params[4].split("=")[1])
    }
    response_status = req_business_search(json_params)
    print('Response status: ' + str(response_status))
    return response_status


@app.route("/api/business_detail/", methods = ["GET"])
def business_detail():
    business_id = request.full_path.split("?")[-1].split("=")[-1]

    response_status = req_business_detail(business_id)
    print('Response status: ' + str(response_status))
    return response_status


if __name__ == '__main__':
    app.run(debug = True, use_reloader = True)
