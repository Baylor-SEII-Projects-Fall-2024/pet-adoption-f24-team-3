import requests
import json
import os
from requests.exceptions import RequestException
from .config import API_BASE_URL

def api_post_img(endpoint: str, imageFile: str):
    if not os.path.exists(imageFile):
        print(f"Image file not found: {imageFile}. Skipping request.")
        return None

    print(f"Sending request to {API_BASE_URL}/{endpoint}")
    try:
        with open(imageFile, "rb") as imgFile:
            files = {"imageFile": imgFile}
            response = requests.post(f"{API_BASE_URL}/{endpoint}", files=files)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        print(f"Error posting image: {e}")
        return None

def api_post(endpoint: str, data: json):
    print(f"Sending request to {API_BASE_URL}/{endpoint}")
    try:
        response = requests.post(f"{API_BASE_URL}/{endpoint}", json=data)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        print(f"Error posting data: {e}")
        return None

def api_get(endpoint):
    try:
        response = requests.get(f"{API_BASE_URL}/{endpoint}")
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        print(f"Error getting data: {e}")
        return None

def pretty_print_json(data):
    try:
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except TypeError as e:
        print(f"Error printing JSON: {e}")

def save_pretty_json(data, filename, mode='w'):
    try:
        with open(filename, mode, encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except (IOError, TypeError) as e:
        print(f"Error saving JSON to file: {e}")

def append_pretty_json(data, filename):
    try:
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
    except (IOError, TypeError, json.JSONDecodeError) as e:
        print(f"Error appending JSON to file: {e}")

