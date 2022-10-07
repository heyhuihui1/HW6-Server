import requests
import re
import sys
import json

API_KEY = 'VyzYI5BjMrIeDUsNyL6G3yJeVko2kqhi1YRogzPZkbbnv-KzflCU9Zjg3SmmIPhXfaLtxP0fwrNh655MNjexuJ4lbB9oSYP90ZjtsHqkh3fJiRoPiJtiZoZgoII4Y3Yx'
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'
DETAIL_PATH = '/v3/businesses/'


def req_business_search(url_params):
    url = API_HOST + SEARCH_PATH
    headers = {
        'Authorization': 'Bearer %s' % API_KEY
    }
    response = requests.request('GET', url, headers=headers, params=url_params)
    print(response.json())
    return response.json()


def req_business_detail(id):
    print("business_id: " + id)
    url = API_HOST + DETAIL_PATH + id
    headers = {
        'Authorization': 'Bearer %s' % API_KEY
    }
    response = requests.request('GET', url, headers=headers)
    print(response.json())
    return response.json()


if __name__ == '__main__':
    req_business_detail("WavvLdfdP6g8aZTtbBQHTw")
    # req_yelp(json_param)
