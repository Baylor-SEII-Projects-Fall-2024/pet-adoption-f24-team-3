import requests

# Production -- USE WITH CAUTION
# API_BASE_URL = "http://35.184.141.85:8080"

# Development
API_BASE_URL = "http://localhost:8080"

print(f"Clearing tables from {API_BASE_URL}")
confirmation = input("Are you sure you want to clear all tables? This action cannot be undone. (yes/no): ").lower()

if confirmation != 'yes':
    print("Operation cancelled. Exiting script.")
    sys.exit()

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

