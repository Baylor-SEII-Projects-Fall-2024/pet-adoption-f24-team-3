# modules/clear-db.py
import os
import requests
import shutil
import sys
from modules.config import API_URLS

valid_environments = ['local', 'dev', 'prod', 'backup']

def usage():
    print("Usage: python3 clear-db.py <environment>")
    print("  environments = [local, dev, prod, backup]")

# Parse arguments
if len(sys.argv) != 2:
    usage()
    sys.exit(1)

environment = sys.argv[1]

if environment not in valid_environments:
    usage()
    sys.exit(1)

API_BASE_URL = API_URLS.get(environment)

print(f"You are about to CLEAR data from {environment.upper()} environment at {API_BASE_URL}")
confirm = input("Do you want to continue? (y/n): ").strip().lower()
if confirm != 'y':
    print("Operation cancelled")
    sys.exit(0)

endpoints = {
    "clear-table-users",
    "clear-table-preferences",
    "clear-table-pets",
    "clear-table-events",
    "clear-table-chats",
    "clear-table-interactions",
    "clear-table-messages"
}

def clear(url: str, endpoint: str):
    table = endpoint.split('-')[-1].capitalize()
    full_url = f"{url}/{endpoint}"
    print(f"> Posting to {full_url}")
    try:
        response = requests.post(f"{url}/{endpoint}")
        response.raise_for_status()
        print(f"  Successfully cleared {endpoint}")
    except Exception as e:
        print(f"  Error: {e}")
    print()

# >>>> Clear Tables >>>>
clear(API_BASE_URL, "clear-table-users")
clear(API_BASE_URL, "clear-table-preferences")
clear(API_BASE_URL, "clear-table-pets")
clear(API_BASE_URL, "clear-table-events")
clear(API_BASE_URL, "clear-table-chats")
clear(API_BASE_URL, "clear-table-interactions")
clear(API_BASE_URL, "clear-table-messages")
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
