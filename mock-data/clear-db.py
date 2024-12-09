# modules/clear-db.py
import os
import requests
import shutil
import sys
from modules.config import API_URLS
from dotenv import load_dotenv
import argparse

# Load environment variables from .env file
load_dotenv()

def usage():
    print("Usage: python3 clear-db.py <environment> <bearer_token>")
    print("  environments = [local, dev, prod, backup]")
    print("  bearer_token = [authorization token like the one used in postman]")

# Define valid environments and sizes
valid_environments = ['local', 'dev', 'prod', 'backup', 'guilt']

# Function to validate environment
def validate_environment(env):
    if env not in valid_environments:
        print(f"Error: Invalid environment '{env}'. Valid options are: {', '.join(valid_environments)}")
        sys.exit(1)

# Set up argparse to parse arguments
parser = argparse.ArgumentParser(description="Generate script with environment  and optional auth token.")
parser.add_argument("environment", help="The environment to use", choices=valid_environments)
parser.add_argument("auth_token", help="The authorization token", nargs="?", default=None)  # Optional argument

# Parse arguments
try:
    args = parser.parse_args()
except SystemExit:
    usage()
    sys.exit(1)

# Validate the environment and size (done with choices in argparse)
validate_environment(args.environment)
environment = args.environment

# Determine auth_token
if args.auth_token:
    auth_token = args.auth_token
else:
    auth_token = os.getenv(f"{environment}_auth_token")  # Try to get from .env

if not auth_token:
    print("Error: auth_token is required and was not provided on the command line or in the .env file.")
    sys.exit(1)

API_BASE_URL = API_URLS.get(environment)

if(API_BASE_URL == None):
    print(f"Invalid url: {API_BASE_URL}");
    sys.exit(1)

print(f"You are about to CLEAR data from {environment.upper()} environment at {API_BASE_URL}")
confirm = input("Do you want to continue? (y/n): ").strip().lower()
if confirm != 'y':
    print("Operation cancelled")
    sys.exit(0)

# Clear _json files
for file in [f"{environment}_MOCK_CENTERS.json",
             f"{environment}_MOCK_OWNERS.json",
             f"{environment}_MOCK_PETS.json",
             f"{environment}_MOCK_EVENTS.json",
             f"{environment}_MOCK_PREFERENCES.json"]:
    filepath = os.path.join('_json', file)
    if os.path.exists(filepath):
        os.remove(filepath)
        print(f"Deleted existing file: {filepath}")

def clear(url: str, endpoint: str):
    table = endpoint.split('-')[-1].capitalize()
    full_url = f"{url}/{endpoint}"
    headers = {"Authorization": f"Bearer {auth_token}"}
    print(f"> Posting to {full_url}")
    try:
        response = requests.post(f"{full_url}", headers=headers)
        response.raise_for_status()
        print(f"  Successfully cleared {endpoint}")
    except Exception as e:
        print(f"  Error: {e}")
    print()

# >>>> Clear Tables >>>>
clear(API_BASE_URL, "clear-all")
# <<<< Clear Tables <<<<

# <<<< Clear pet-adoption-api/uploads <<<<
if environment == "local":
    confirmation = input("Would you like to clear pet-adoption-api/uploads? (y/n): ").lower()

    if confirmation == 'y':
        print("Removing uploads directory if it exists")
        uploads_dir = "../pet-adoption-api/uploads"
        if os.path.exists(uploads_dir):
            try:
                shutil.rmtree(uploads_dir)
                print(f"Successfully removed {uploads_dir} directory")
            except Exception as e:
                print(f"Error removing {uploads_dir} directory: {e}")
        else:
            print(f"{uploads_dir} directory does not exist")
# <<<< Clear pet-adoption-api/uploads <<<<
