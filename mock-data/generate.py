# modules/generate.py

import os
import sys
from modules.config import API_URLS, faker, random, center_names_provider
from modules.models import Sex, AgeClass, Size
from modules.generators import (
    generate_adoption_center,
    generate_potential_owner,
    generate_pet,
    generate_event,
    generate_preference
)
from modules.static import generate_static_accounts
from modules.utils import api_post, api_get, api_post_img
from modules.utils import save_pretty_json, append_pretty_json, pretty_print_json
from modules.utils import clean_uploads
from modules.images import generate_image, ImageType, generate_animal_image
from collections import Counter
from modules.logger import logger

valid_environments = ['local', 'dev', 'prod', 'backup']
valid_sizes = ['small', 's', 'medium', 'm', 'large', 'l']

def usage():
    print("Usage: python3 generate.py <environment> <size>")
    print("  environments = [local, dev, prod, backup]")
    print("  size         = [small | s, medium | m, large | l]")
    print("  authorizationToken =[authorization token like the one used in postman]")

# Parse arguments
if len(sys.argv) != 4:
    usage()
    sys.exit(1)

environment = sys.argv[1]
size = sys.argv[2]
authToken= sys.argv[3]

if environment not in valid_environments:
    usage()
    sys.exit(1)
if size not in valid_sizes:
    usage()
    sys.exit(1)

url = API_URLS.get(environment)

# NUMBER OF GENERATIONS
if size in ['small', 's']:
    num_centers = 5
    num_owners = 5
    min_pets_per_center = 5
    max_pets_per_center = 5
    min_events_per_center = 5
    max_events_per_center = 5
elif size in ['medium', 'm']:
    num_centers = len(center_names_provider.elements)
    num_owners = 50
    min_pets_per_center = 10
    max_pets_per_center = 20
    min_events_per_center = 5
    max_events_per_center = 10
elif size in ['large', 'l']:
    num_centers = len(center_names_provider.elements)
    num_owners = 50
    min_pets_per_center = 30
    max_pets_per_center = 40
    min_events_per_center = 10
    max_events_per_center = 15

size_full = {'small': 'small', 's': 'small', 'medium': 'medium', 'm': 'medium', 'large': 'large', 'l': 'large'}
logger.info(f"You are about to generate data in {environment.upper()} at {url} with a '{size_full[size]}' size.")
confirm = input("Do you want to continue? (y/n): ").strip().lower()
if confirm != 'y':
    logger.info("Operation cancelled")
    sys.exit(0)

# Delete existing JSON files
for file in [f"{environment}_MOCK_CENTERS.json",
             f"{environment}_MOCK_OWNERS.json",
             f"{environment}_MOCK_PETS.json",
             f"{environment}_MOCK_EVENTS.json",
             f"{environment}_MOCK_PREFERENCES.json"]:
    if os.path.exists(file):
        os.remove(file)
        logger.info(f"Deleted existing file: {file}")


# Generate static values
static_centers, static_owners = generate_static_accounts()

adoption_centers = static_centers.copy()
potential_owners = static_owners.copy()

# Generate random values
adoption_centers.extend([generate_adoption_center() for _ in range(0, num_centers)])
potential_owners.extend([generate_potential_owner() for _ in range(0, num_owners)])

save_pretty_json(adoption_centers, f"{environment}_MOCK_CENTERS.json")
save_pretty_json(potential_owners, f"{environment}_MOCK_OWNERS.json")

for owner in potential_owners:
    try:
        logger.info(f"Saving {owner['nameFirst']} {owner['nameLast']}")
        response = api_post(url, "api/auth/register/owner", owner, "  ")
        user_id = response['userId']

        response = api_post_img(url, f"api/images/users/{user_id}/profile", generate_image(ImageType.OWNER, user_id), "  ",authToken)

        # Generate a preference for this user
        preference = generate_preference(user_id)
        logger.info(f"  Saving preference to {owner['nameFirst']} {owner['nameLast']}")
        append_pretty_json([preference], f"{environment}_MOCK_PREFERENCES.json")
        api_post(url, f"api/update/preferences/{user_id}", preference, "    ",authToken)
    except Exception as e:
        logger.error(f"Error adding owner. Reason: {e}")

logger.info("\n==========\n")

species_counter = Counter()

for center in adoption_centers:
    try:
        logger.info(f"Saving {center['name']}")
        response = api_post(url, "api/auth/register/center", center, "  ")
        user_id = response['userId']

        # Generate some pets and events for this center
        num_pets = random.randint(min_pets_per_center, max_pets_per_center)
        num_events = random.randint(min_events_per_center, max_events_per_center)

        pets = []
        events = []
        for _ in range(num_pets):
            pet = generate_pet(user_id)
            pets.append(pet)
            species_counter[pet['species']] += 1
        for _ in range(num_events):
            event = generate_event(user_id)
            events.append(event)
        append_pretty_json(pets, f"{environment}_MOCK_PETS.json")
        append_pretty_json(events, f"{environment}_MOCK_EVENTS.json")

        response = api_post_img(url, f"api/images/users/{user_id}/profile", generate_image(ImageType.CENTER, user_id), "    ",authToken)
        response = api_post_img(url, f"api/images/users/{user_id}/banner", generate_image(ImageType.BANNER, user_id), "    ",authToken)

        for pet in pets:
            logger.info(f"  Saving pet {pet['name']} to {center['name']}")
            response = api_post(url, "api/animals/", pet, "    ",authToken)
            pet_id = response['id']

            try:
                img_url = generate_animal_image(pet['species'], pet['breed'], pet_id)
                if img_url:
                    response = api_post_img(url, f"api/images/animals/{pet_id}", img_url, "      ",authToken)
                    logger.info(f"      Successfully added image for pet {pet_id}")
                else:
                    logger.warning(f"      No image generated for pet {pet_id}")
            except Exception as e:
                logger.error(f"      Failed to generate image {pet_id}")
                continue # Skip to next pet

        for event in events:
            logger.info(f"  Saving event {event['name']} to {center['name']}")
            response = api_post(url, "api/events/", event, "    ",authToken)
            event_id = response['eventID']
            response = api_post_img(url, f"api/images/events/{event_id}", generate_image(ImageType.EVENT, event_id), "    ",authToken)
    except Exception as e:
        logger.error(f"Error while adding center. Reason: {e}")

logger.info("Species Distributions:")
total_pets = sum(species_counter.values())
logger.info(f"total pets generated: {total_pets}")
for species, count in species_counter.items():
    percentage = (count / total_pets) * 100
    logger.info(f"{species}: {count} ({percentage:.2f}%)")

logger.info("Cleaning up uploads directory")
clean_uploads("uploads")
logger.info("All files inside uploads/ have been deleted.")
