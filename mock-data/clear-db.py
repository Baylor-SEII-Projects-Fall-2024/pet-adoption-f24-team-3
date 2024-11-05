import os
import requests
import shutil
import sys

# Production - Brendon's Runner -- USE WITH CAUTION
# API_BASE_URL = "http://35.184.141.85:8080"

# Remote Dev - Icko's Runner
# API_BASE_URL = "http://35.184.141.85:8080"

# Local Development
API_BASE_URL = "http://localhost:8080"

# >>>> Clear Tables >>>>
print(f"Clearing tables from {API_BASE_URL}")
confirmation = input("Are you sure you want to clear all tables? This action cannot be undone. (yes/no): ").lower()

if confirmation == 'yes':
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

# >>>> Clear Mock Uploads >>>>
confirmation = input("Would you like to clear mock-data/uploads? (yes/no): ").lower()

if confirmation == 'yes':
    print("Removing uploads directory if it exists")
    uploads_dir = "uploads"
    if os.path.exists(uploads_dir):
        try:
            shutil.rmtree(uploads_dir)
            print(f"Successfully removed {uploads_dir} directory")
        except Exception as e:
            print(f"Error removing {uploads_dir} directory: {e}")
    else:
        print(f"{uploads_dir} directory does not exist")
# <<<< Clear Mock Uploads <<<<

# <<<< Clear pet-adoption-api/uploads <<<<
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
