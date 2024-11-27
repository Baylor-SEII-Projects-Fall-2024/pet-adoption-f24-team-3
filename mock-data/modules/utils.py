# modules/utils.py

import requests
import json
import os
import shutil
from .logger import logger

def api_post_img(url: str, endpoint: str, imageFile: str, indent: str,token:str):
    logger.info(f"{indent}Sending request to {url}/{endpoint}")

    # Open file in binary mode to read and send
    with open(imageFile, "rb") as imgFile:
        files = {"imageFile": imgFile}
        response = requests.post(f"{url}/{endpoint}", files=files,headers={'Authorization': f'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwb3RlbnRpYWxPd25lckBleGFtcGxlLmNvbSIsImlhdCI6MTczMjczMDY3MSwiZXhwIjoxNzM1MzIyNjcxfQ.GN4MLCCVI7QCA8CwyeIx-mZuy21-qjFty6vs10FpOdc'})
    response.raise_for_status()
    return response.json()

def api_post(url: str, endpoint: str, data: json, indent:str,token:str=None):
    logger.info(f"{indent}Sending request to {url}/{endpoint}")
    logger.info(f"{url}/{endpoint}")

    headers={}
    if token:
        headers={'Authorization': f'Bearer {token}'}

    response = requests.post(f"{url}/{endpoint}", json=data, headers=headers)
    response.raise_for_status()
    return response.json()

def api_get(url: str, endpoint: str,token:str):
    response = requests.get(f"{url}/{endpoint}",headers={'Authorization': f'Bearer {token}'})
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

def clean_uploads(uploads_dir):
    if not os.path.exists(uploads_dir):
        logger.warning(f"    {uploads_dir} does not exist")
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
                logger.error(f"      Failed to delete {file_path}. Reason: {e}")
        logger.info(f"  Removed {count} files/directories from {uploads_dir}")
