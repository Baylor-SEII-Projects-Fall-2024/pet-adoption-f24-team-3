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

print(f"You are about to CLEAR data from {API_BASE_URL}")
confirm = input("Do you want to continue? (y/n): ").strip().lower()
if confirm != 'y':
    print("Operation cancelled")
    sys.exit(0)

# >>>> Clear Tables >>>>
print("Clearing users table")
response = requests.post(f"{API_BASE_URL}/clear-table-users")
response.raise_for_status()
print(response)

print("Clearing preferences table")
response = requests.post(f"{API_BASE_URL}/clear-table-preferences")
response.raise_for_status()
print(response)

print("Clearing pets table")
response = requests.post(f"{API_BASE_URL}/clear-table-pets")
response.raise_for_status()
print(response)

print("Clearing events table")
response = requests.post(f"{API_BASE_URL}/clear-table-events")
response.raise_for_status()
print(response)
# <<<< Clear Tables <<<<

# <<<< Clear pet-adoption-api/uploads <<<<
if environment == "local":
    confirmation = input("Would you like to clear pet-adoption-api/uploads? (yes/no): ").lower()

    if confirmation == 'yes':
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
