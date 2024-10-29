import os
import requests
from enum import Enum
from .config import faker

class ImageType(Enum):
    PET = "pet"
    BANNER = "banner"
    CENTER = "center"
    OWNER = "owner"
    EVENT = "event"

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
