# modules/generate.py

import os
import sys
from modules.config import API_URLS, center_names_provider
from modules.generators import (
    generate_adoption_center,
    generate_potential_owner,
    generate_pet,
    generate_event,
    generate_preference
)
import random
from modules.static import generate_static_accounts
from modules.utils import api_post, api_post_update, api_post_img
from modules.utils import save_pretty_json, append_pretty_json
from modules.utils import clean_uploads
from modules.images import generate_image, ImageType, generate_animal_image
from collections import Counter
from modules.logger import logger
from dotenv import load_dotenv, set_key
import argparse
import requests

# Load environment variables from .env file
load_dotenv()

# Function to register a new owner and get the auth token
def register_new_owner(baseurl):
    random_number = random.randint(1000,9999)
    url = f"{baseurl}/api/auth/register/owner"
    owner_data = {
        "accountType": "Owner",
        "emailAddress": f"awef{random_number}@awef.com",
        "password": "Passw0rd!",
        "nameFirst": "awef",
        "nameLast": "awef"
    }

    try:
        response = requests.post(url, json=owner_data)
        response.raise_for_status()
        data = response.json()
        if 'token' in data:
            auth_token = data['token']
            logger.info("New owner registered successfully, token received.")
            # Save the auth token in the .env file
            set_key(".env", f"{environment}_auth_token", auth_token)
            return auth_token
        else:
            logger.error("Error: Token not found in response.")
            sys.exit(1)
    except requests.RequestException as e:
        logger.error(f"Error registering new owner: {e}")
        sys.exit(1)

# Grabs auth token by generating a user
def get_auth_token(url, environment):
    if args.new:
        logger.info("Registering a new account...")
        auth_token = register_new_owner(url)
    else:
        auth_token = os.getenv(f"{environment}_auth_token")
        if not auth_token:
            logger.error("Error: auth_token is required and was not provided.")
            sys.exit(1)
    return auth_token

# Define valid environments and sizes
valid_environments = ['local', 'dev', 'prod', 'backup', 'guilt']
valid_sizes = ['small', 's', 'medium', 'm', 'large', 'l', 'grief-size', 'gf']

def usage():
    print("Usage: python3 generate.py [--new] <environment> <size> [<auth_token>]")
    print("  --new        = Grabs a new auth token by registering a new account")
    print("  environments = [local, dev, prod, backup, guilt]")
    print("  size         = [small | s, medium | m, large | l, grief-size | gf]")
    print("  auth_token   = [authorization token like the one used in Postman]")
    
# Function to validate environment
def validate_environment(env):
    if env not in valid_environments:
        print(f"Error: Invalid environment '{env}'. Valid options are: {', '.join(valid_environments)}")
        sys.exit(1)

# Function to validate size
def validate_size(size):
    if size not in valid_sizes:
        print(f"Error: Invalid size '{size}'. Valid options are: {', '.join(valid_sizes)}")
        sys.exit(1)

# Set up argparse to parse arguments
parser = argparse.ArgumentParser(description="Generate script with environment, size, and optional auth token.")
parser.add_argument("environment", help="The environment to use", choices=valid_environments)
parser.add_argument("size", help="The size to use", choices=valid_sizes)
parser.add_argument("--new", help="Pass when generating new data to register a new account and grab auth token", action="store_true")
parser.add_argument("auth_token", help="The authorization token", nargs="?", default=None)  # Optional argument

# Parse arguments
try:
    args = parser.parse_args()
except SystemExit:
    usage()
    sys.exit(1)

# Validate the environment and size (done with choices in argparse)
validate_environment(args.environment)

size = args.size
environment = args.environment
url = API_URLS.get(environment)

auth_token = get_auth_token(url, environment)

# Use the values
print(f"Environment: {environment}")
print(f"Size: {size}")
print(f"Auth Token: {auth_token}")

# Check if the URL is None and handle the case where it's not valid
if url is None:
    print(f"Error: No URL found for environment '{environment}'. Please check your API_URLS configuration.")
    sys.exit(1)


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
elif size in ['grief-size', 'gf']:
    num_centers = 5
    num_owners = 200
    min_pets_per_center = 5
    max_pets_per_center = 5
    min_events_per_center = 5
    max_events_per_center = 5

size_full = {
    'small': 'small',
    's': 'small',
    'medium': 'medium',
    'm': 'medium',
    'large': 'large',
    'l': 'large',
    'grief-size': 'grief-size',
    'gf': 'grief-size'
}
logger.info(f"You are about to generate data in {environment.upper()} at {url} with a '{size_full[size]}' size.")
confirm = input("Do you want to continue? (y/n): ").strip().lower()
if confirm != 'y':
    logger.info("Operation cancelled")
    sys.exit(0)

# Generate static values
static_centers, static_owners = generate_static_accounts()

adoption_centers = static_centers.copy()
potential_owners = static_owners.copy()

# Generate random values
adoption_centers.extend([generate_adoption_center() for _ in range(0, num_centers)])
potential_owners.extend([generate_potential_owner() for _ in range(0, num_owners)])

save_pretty_json(adoption_centers, f"{environment}_MOCK_CENTERS.json")
save_pretty_json(potential_owners, f"{environment}_MOCK_OWNERS.json")

# Function to check if an owner is in static_owners
def is_static_owner(owner, static_owners):
    for static_owner in static_owners:
        if owner['emailAddress'] == static_owner['emailAddress']:
            return True
    return False

for owner in potential_owners:
    try:
        # Register the owner
        logger.info(f"Saving {owner['nameFirst']} {owner['nameLast']}")
        response = api_post(url, "api/auth/register/owner", owner, 2, auth_token)
        user_id = response['userId']

        # Generate and save image
        response = api_post_img(url, f"api/images/users/{user_id}/profile", generate_image(ImageType.OWNER, user_id), 2, auth_token)

        if not is_static_owner(owner, static_owners):
            # Generate a random number of dislikes
            max_dislike = 100
            dislike_count = random.randint(0, max_dislike)
            kill_count = random.randint(0, max_dislike // 5)  # Every 5 dislikes correspond to one kill

            # Set the generated counts
            logger.info(f"  Setting dislike count to {dislike_count} and kill count to {kill_count} for {owner['nameFirst']} {owner['nameLast']}")
            api_post_update(url, f"api/grief/setDislikeCount/{user_id}/{dislike_count}", 4, auth_token)
            api_post_update(url, f"api/grief/setKillCount/{user_id}/{kill_count}", 4, auth_token)

        # Generate a preference for this user
        preference = generate_preference(user_id)
        logger.info(f"  Saving preference to {owner['nameFirst']} {owner['nameLast']}")
        append_pretty_json([preference], f"{environment}_MOCK_PREFERENCES.json")
        api_post(url, f"api/update/preferences/{user_id}", preference, 4, auth_token)
    except Exception as e:
        logger.error(f"Error adding owner. Reason: {e}")

logger.info("\n==========\n")

species_counter = Counter()

for center in adoption_centers:
    try:
        # Register the center
        logger.info(f"Saving {center['name']}")
        response = api_post(url, "api/auth/register/center", center, 2, auth_token)
        user_id = response['userId']

        # Generate some pets and events for this center
        num_pets = random.randint(min_pets_per_center, max_pets_per_center)
        num_events = random.randint(min_events_per_center, max_events_per_center)

        pets = []
        events = []
        # Generate random pets
        for _ in range(num_pets):
            pet = generate_pet(user_id)
            pets.append(pet)
            species_counter[pet['species']] += 1
        # Generate random events
        for _ in range(num_events):
            event = generate_event(user_id)
            events.append(event)
        append_pretty_json(pets, f"{environment}_MOCK_PETS.json")
        append_pretty_json(events, f"{environment}_MOCK_EVENTS.json")

        # Save center images
        response = api_post_img(url, f"api/images/users/{user_id}/profile", generate_image(ImageType.CENTER, user_id), 4, auth_token)
        response = api_post_img(url, f"api/images/users/{user_id}/banner", generate_image(ImageType.BANNER, user_id), 4, auth_token)

        # Save each pet
        for pet in pets:
            logger.info(f"  Saving pet {pet['name']} to {center['name']}")
            response = api_post(url, "api/animals/", pet, 4, auth_token)
            pet_id = response['id']

            # Attempt to hit pet apis for image generation
            try:
                img_url = generate_animal_image(pet['species'], pet['breed'], pet_id)
                if img_url:
                    response = api_post_img(url, f"api/images/animals/{pet_id}", img_url, 6, auth_token)
                    logger.info(f"      Successfully added image for pet {pet_id}")
                else:
                    logger.warning(f"      No image generated for pet {pet_id}")
            except Exception as e:
                logger.error(f"      Failed to generate image {pet_id}")
                continue # Skip to next pet

        # Save each event
        for event in events:
            logger.info(f"  Saving event {event['name']} to {center['name']}")
            response = api_post(url, "api/events/", event, 4, auth_token)
            event_id = response['eventID']
            response = api_post_img(url, f"api/images/events/{event_id}", generate_image(ImageType.EVENT, event_id), 4, auth_token)
    except Exception as e:
        logger.error(f"Error while adding center. Reason: {e}")

logger.info("Species Distributions:")
total_pets = sum(species_counter.values())
logger.info(f"total pets generated: {total_pets}")
for species, count in species_counter.items():
    percentage = (count / total_pets) * 100
    logger.info(f"{species}: {count} ({percentage:.2f}%)")

logger.info("Cleaning up uploads directory")
clean_uploads("uploads", 2)
logger.info("All files inside uploads/ have been deleted.")
