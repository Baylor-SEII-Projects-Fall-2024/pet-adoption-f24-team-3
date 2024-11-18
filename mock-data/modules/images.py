# modules/images.py

import os
import requests
import mimetypes
import random
from enum import Enum
from .config import faker
from .models import ImageType
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup

def generate_image(type: ImageType, id: int):
    dimensions = {
        ImageType.PET: (200, 300),
        ImageType.BANNER: (1200, 400),
        ImageType.CENTER: (300, 300),
        ImageType.OWNER: (300, 300),
        ImageType.EVENT: (300, 300)
    }

    width, height = dimensions[type]

    img_url = f"https://picsum.photos/{width}/{height}"

    if type in [ImageType.CENTER, ImageType.BANNER, ImageType.OWNER]:
        img_path = os.path.join("uploads", "users", str(id), f"{type.value}_{id}.jpg")
    elif type == ImageType.PET:
        img_path = os.path.join("uploads", "animals", str(id), f"{type.value}_{id}.jpg")
    elif type == ImageType.EVENT:
        img_path = os.path.join("uploads", "events", str(id), f"{type.value}_{id}.jpg")

    os.makedirs(os.path.dirname(img_path), exist_ok=True)

    # Download image
    response = requests.get(img_url)
    if response.status_code == 200:
        with open(img_path, "wb") as f:
            f.write(response.content)

    return img_path

def download_img(img_url, id, species):
    response = requests.get(img_url)
    if response.status_code == 200:
        content_type = response.headers.get('content-type')
        extension = mimetypes.guess_extension(content_type)

        if extension is None:
            extension = '.jpg'

        img = Image.open(BytesIO(response.content))

        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA'):
            img = img.convert('RGB')

        upload_dir = os.path.join("uploads", "animals")
        os.makedirs(upload_dir, exist_ok=True)

        image_path = os.path.join(upload_dir, f"{species}_{id}{extension}")

        img.save(image_path)
        return image_path
    else:
        return None

def get_image_url(page_url):
    response = requests.get(page_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        img_tag = soup.find('img', id='cat')
        if img_tag and 'src' in img_tag.attrs:
            return img_tag['src']
    return None

def generate_animal_image(species: str, breed: str, id: int):
    if species.lower() == "dog":
        api_url = f"https://dog.ceo/api/breed/{breed.replace(' ', '').lower()}/images/random"
        response = requests.get(api_url)
        img_url = response.json()['message']
    elif species.lower() == "cat":
        # Cats range from 0 to 1677
        cat_id = random.randint(0, 1677)
        page_url = f"https://random.cat/view/{cat_id}"
        img_url = get_image_url(page_url)
        if not img_url:
            return generate_image(ImageType.PET, id)
    elif species.lower() == "duck":
        api_url = "https://random-d.uk/api/quack"
        response = requests.get(api_url)
        img_url = response.json()['url']
    elif species.lower() == "fox":
        api_url = "https://randomfox.ca/floof/"
        response = requests.get(api_url)
        img_url = response.json()['image']
    elif species.lower() == "raccoon":
        api_url = "https://api.racc.lol/v1/raccoon?json=true"
        response = requests.get(api_url)
        img_url = response.json()['data']['url']
    elif species.lower() == "frog":
        # Frogs range from 0001 to 0054
        frog_id = str(random.randint(1, 54)).zfill(4)
        img_url = f"https://allaboutfrogs.org/funstuff/random/{frog_id}.jpg"
    else:
        return generate_image(ImageType.PET, id)

    return download_img(img_url, id, species.lower())
