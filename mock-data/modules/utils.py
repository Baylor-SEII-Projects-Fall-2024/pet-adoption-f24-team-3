import requests
import json
import os
from .config import API_BASE_URL

def api_post_img(endpoint: str, imageFile: str):
    print(f"Sending request to {API_BASE_URL}/{endpoint}")

    # Open file in binary mode to read and send
    with open(imageFile, "rb") as imgFile:
        files = {"imageFile": imgFile}
        response = requests.post(f"{API_BASE_URL}/{endpoint}", files=files)
    response.raise_for_status()
    return response.json()

def api_post(endpoint: str, data: json):
    print(f"Sending request to {API_BASE_URL}/{endpoint}")
    response = requests.post(f"{API_BASE_URL}/{endpoint}", json=data)
    response.raise_for_status()
    return response.json()

def api_get(endpoint):
    response = requests.get(f"{API_BASE_URL}/{endpoint}")
    response.raise_for_status()
    return response.json()

def pretty_print_json(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

def save_pretty_json(data, filename, mode='w'):
    with open(filename, mode, encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def append_pretty_json(data, filename):
    if os.path.exists(filename):
        with open(filename, 'r+', encoding='utf-8') as f:
            file_data = json.load(f)
            if isinstance(file_data, list):
                file_data.extend(data)
            elif isinstance(file_data, dict):
                file_data.update(data)
            f.seek(0)
            json.dump(file_data, f, indent=2, ensure_ascii=False)
            f.truncate()
    else:
        save_pretty_json(data, filename)
