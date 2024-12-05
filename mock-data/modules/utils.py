# modules/utils.py

import requests
import json
import os
import shutil
from .logger import logger

def api_post_img(url: str, endpoint: str, imageFile: str, indentSize: int, token:str):
    indent = ' ' * indentSize
    logger.info(f"{indent}Sending request to {url}/{endpoint}")

    # Open file in binary mode to read and send
    with open(imageFile, "rb") as imgFile:
        files = {"imageFile": imgFile}
        response = requests.post(f"{url}/{endpoint}", files=files,headers={'Authorization': f'Bearer {token}'})
    response.raise_for_status()
    return response.json()

def api_post(url: str, endpoint: str, data, indentSize:int, token:str):
    indent = ' ' * indentSize
    logger.info(f"{indent}Sending request to {url}/{endpoint}")

    headers={'Authorization': f'Bearer {token}'}

    response = requests.post(f"{url}/{endpoint}", json=data, headers=headers)
    response.raise_for_status()
    return response.json()

def api_post_update(url: str, endpoint: str, indentSize:int, token:str):
    indent = ' ' * indentSize
    logger.info(f"{indent}Sending request to {url}/{endpoint}")

    headers={'Authorization': f'Bearer {token}'}

    response = requests.post(f"{url}/{endpoint}", headers=headers)
    response.raise_for_status()

def api_get(url: str, endpoint: str, token:str):
    response = requests.get(f"{url}/{endpoint}",headers={'Authorization': f'Bearer {token}'})
    response.raise_for_status()
    return response.json()

def pretty_print_json(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

def save_pretty_json(data, filename, mode='a'):
    """Save JSON data to a file in the `_json` directory."""
    os.makedirs('_json', exist_ok=True)  # Ensure the `_json` directory exists
    filepath = os.path.join('_json', filename)
    with open(filepath, mode, encoding='utf-8') as f:
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

def clean_uploads(uploads_dir, indentSize:int):
    indent = ' ' * indentSize;
    if not os.path.exists(uploads_dir):
        logger.warning(f"{uploads_dir} does not exist")
    else:
        count = 0
        for filename in os.listdir(uploads_dir):
            file_path = os.path.join(uploads_dir, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                    count += 1
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                    count += 1
            except Exception as e:
                logger.error(f"{indent}  Failed to delete {file_path}. Reason: {e}")
        logger.info(f"{indent}Removed {count} files/directories from {uploads_dir}")
