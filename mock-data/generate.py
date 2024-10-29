import os
import requests
import random
import json
from datetime import datetime, timedelta
from enum import Enum
from faker import Faker
from faker.providers import DynamicProvider

faker = Faker()

# Comment for non-deterministic generation
faker.seed_instance(420)
random.seed(69)

#API_BASE_URL = "http://35.184.141.85:8080"
API_BASE_URL = "http://localhost:8080"

class Sex(Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"

class AgeClass(Enum):
    BABY = "BABY"
    ADOLESCENT = "ADOLESCENT"
    ADULT = "ADULT"
    OLD = "OLD"

class Size(Enum):
    EXTRA_SMALL = "EXTRA_SMALL"
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"
    EXTRA_LARGE = "EXTRA_LARGE"

city_state_map = {
    "New York City": "NY",
    "Los Angeles": "CA",
    "Santa Clara": "CA",
    "San Jose": "CA",
    "San Diego": "CA",
    "Chicago": "IL",
    "Houston": "TX",
    "Dallas": "TX",
    "Austin": "TX",
    "Waco": "TX",
    "Pheonix": "AZ",
    "Springfield": "IL",
    "West Haven": "CT"
}

# Sample center names
center_names_provider = DynamicProvider(
    provider_name="center_names",
    elements = [
        'Paws & Claws Rescue',
        'Furry Friends Sanctuary',
        'Whiskers & Tails Shelter',
        'Happy Tails Adoption Center',
        'Second Chance Pet Haven',
        'Loving Hearts Animal Rescue',
        'Forever Home Pet Adoption',
        'Rainbow Bridge Shelter',
        'Pawsitive Beginnings',
        'Tail Waggers Rescue Center',
        'Purr-fect Match Adoptions',
        'New Leash on Life Shelter',
        'Paw Prints Rescue',
        'Bark Avenue Adoption Center',
        'Cuddles & Kisses Pet Sanctuary',
        'Healing Paws Retreat',
        'Fur-ever Friends Shelter',
        'Compassionate Critter Haven',
        'Wildlife Wonders Sanctuary',
        'Pet Paradise Haven',
        'Safe Haven Pet Sanctuary',
        'Happy Paws Haven',
        'Kindred Creatures Sanctuary',
        'Angel Whiskers Shelter',
        'Four-Legged Friends Refuge',
        'Rescue Me Retreat',
        'Friendly Felines Sanctuary',
        'Whiskers and Wagging Tails Shelter',
        'Forever Homes Haven',
        'Animal Allies Sanctuary',
        'Loveable Creatures Shelter',
        'Pet Peaceful Place',
        'Whispers of Hope Sanctuary',
        'Zen Pet Haven',
        'Dreamland Critter Refuge',
        'Charming Creatures Cove',
        'Wondrous Wildlife Shelter',
        'Whispering Haven Sanctuary',
        'Moonlit Paws Refuge',
        'Ethereal Pets Paradise',
        'Sanctuary of Serenity',
        'Enchanted Tails Retreat',
        'Tails of Hope Sanctuary',
        'Fur-Ever Family Shelter',
        'Pawfect Harmony Refuge',
        'Furry Friends United',
        'Hopeful Homes Haven',
        'Critter Comfort Haven',
        'Warm Fuzzy Haven',
        'Gentle Souls Shelter'
    ]
)
faker.add_provider(center_names_provider)

pet_first_provider = DynamicProvider(
    provider_name="pet_first",
    elements=["Captain","Sir","Bongo","Flappy","Knobber","L-dog","Piggers",
              "Tinks","Biscuit","Judge","Warlock","Chunks","Mr.","Ms.",
              "Fluffles","Zoomers","Pickles","Thicken","Crunchwrap",
              "Major","Admiral","Professor","MF","Baron"],
)
faker.add_provider(pet_first_provider)

pet_last_provider = DynamicProvider(
    provider_name="pet_last",
    elements=["McGee","the Throngler","Muncher","Boi","Fluffernutter",
              "Horseface","Thunderbottom","","Nugget","Supreme","DOOM",
              "Churro","Dillier of Dallies","von Buscuit","McSquishface"],
)
faker.add_provider(pet_last_provider)

# Define age and size classifications for different species
species_classifications = {
    "Dog": {
        "age": [(0, 1, AgeClass.BABY),
                (1, 3, AgeClass.ADOLESCENT),
                (3, 8, AgeClass.ADULT),
                (8, 20, AgeClass.OLD)],
        "size": [(0, 10, Size.EXTRA_SMALL),
                 (10, 25, Size.SMALL),
                 (25, 50, Size.MEDIUM),
                 (50, 90, Size.LARGE),
                 (90, 200, Size.EXTRA_LARGE)]
    },
    "Cat": {
        "age": [(0, 1, AgeClass.BABY),
                (1, 2, AgeClass.ADOLESCENT),
                (2, 10, AgeClass.ADULT),
                (10, 20, AgeClass.OLD)],
        "size": [(0, 5, Size.EXTRA_SMALL),
                 (5, 10, Size.SMALL),
                 (10, 15, Size.MEDIUM),
                 (15, 20, Size.LARGE),
                 (20, 50, Size.EXTRA_LARGE)]
    },
    "Rabbit": {
        "age": [(0, 0.5, AgeClass.BABY),
                (0.5, 1, AgeClass.ADOLESCENT),
                (1, 6, AgeClass.ADULT),
                (6, 12, AgeClass.OLD)],
        "size": [(0, 2, Size.EXTRA_SMALL),
                 (2, 4, Size.SMALL),
                 (4, 6, Size.MEDIUM),
                 (6, 8, Size.LARGE),
                 (8, 20, Size.EXTRA_LARGE)]
    },
    "Guinea Pig": {
        "age": [(0, 0.25, AgeClass.BABY),
                (0.25, 0.5, AgeClass.ADOLESCENT),
                (0.5, 4, AgeClass.ADULT),
                (4, 8, AgeClass.OLD)],
        "size": [(0, 0.3, Size.EXTRA_SMALL),
                 (0.3, 0.7, Size.SMALL),
                 (0.7, 1, Size.MEDIUM),
                 (1, 1.3, Size.LARGE),
                 (1.3, 2, Size.EXTRA_LARGE)]
    },
    "Ferret": {
        "age": [(0, 0.25, AgeClass.BABY),
                (0.25, 1, AgeClass.ADOLESCENT),
                (1, 4, AgeClass.ADULT),
                (4, 10, AgeClass.OLD)],
        "size": [(0, 0.3, Size.EXTRA_SMALL),
                 (0.3, 0.7, Size.SMALL),
                 (0.7, 1, Size.MEDIUM),
                 (1, 1.5, Size.LARGE),
                 (1.5, 2.5, Size.EXTRA_LARGE)]
    }
}

# Define breeds for each species
species_breeds = {
    "Dog": [
        "Labrador Retriever",
        "German Shepherd",
        "Golden Retriever",
        "Bulldog",
        "Beagle",
        "Poodle",
        "Rottweiler",
        "Boxer",
        "Dachshund",
        "Siberian Husky"
    ],
    "Cat": [
        "Siamese",
        "Persian",
        "Maine Coon",
        "Ragdoll",
        "Bengal",
        "Sphynx",
        "British Shorthair",
        "Scottish Fold",
        "Russian Blue",
        "American Shorthair"
    ],
    "Rabbit": [
        "Holland Lop",
        "Mini Rex",
        "Netherland Dwarf",
        "Lionhead",
        "French Lop",
        "English Angora",
        "Flemish Giant",
        "Dutch Rabbit",
        "New Zealand Rabbit",
        "Californian Rabbit"
    ],
    "Guinea Pig": [
        "American Guinea Pig",
        "Peruvian Guinea Pig",
        "Abyssinian Guinea Pig",
        "Silkie Guinea Pig",
        "Teddy Guinea Pig",
        "Coronet Guinea Pig",
        "Lunkarya Guinea Pig",
        "White Crested Guinea Pig"
    ],
    "Ferret": [
        "Sable Ferret", 
        "Albino Ferret", 
        "Champagne Ferret", 
        "Cinnamon Ferret", 
        "Black-footed Ferret"
    ]
}

def get_classification(value, ranges):
    for min_val, max_val, classification in ranges:
        if min_val <= value < max_val:
            return classification
    return ranges[-1][2]  # Return the last classification if value exceeds all ranges

def generate_adoption_center():
    city, state = random.choice(list(city_state_map.items()))
    center_name = faker.unique.center_names()
    email_name = center_name.replace(" ","").lower()
    return {
        "accountType": "Center",
        "emailAddress": f"{email_name}@example.com",
        "password": faker.password(),
        "name": center_name,
        "address": faker.unique.street_address(),
        "city": city,
        "state": state,
        "zipCode": faker.postcode(),
        "description": faker.unique.sentence(),
    }

def generate_potential_owner():
    return {
        "accountType": "Owner",
        "emailAddress": faker.unique.email(),
        "nameFirst": faker.first_name(),
        "nameLast": faker.last_name(),
        "password": faker.password(),
    }

def generate_animal_data(species: str):
    age = random.uniform(0 ,species_classifications[species]["age"][-1][1])
    weight = random.uniform(0 ,species_classifications[species]["size"][-1][1])
    height = random.randint(10 ,100) # Simplified height generation
    
    age_class = get_classification(age ,species_classifications[species]["age"])
    size = get_classification(weight ,species_classifications[species]["size"])
    
    return age, age_class, weight, size, height

def generate_preference(id: int):
    species = random.choice(list(species_classifications.keys()))
    age, age_class, weight, size, height = generate_animal_data(species)
    city, state = random.choice(list(city_state_map.items()))
    breed = random.choice(species_breeds.get(species, "Unknown"))
    
    return {
        "userId": f"{id}",
        "species": species,
        "breed": breed,
        "sex": random.choice(list(Sex)).value,
        "ageClass": age_class.value,
        "size": size.value,
        "city": city,
        "state": state,
    }

def generate_pet(center_id: int):
    species = random.choice(list(species_classifications.keys()))
    age, age_class, weight, size, height = generate_animal_data(species)
    breed = random.choice(species_breeds.get(species, "Unknown"))
    
    return {
        "datePosted": (datetime.now() - timedelta(days=random.randint(0 ,365))).isoformat(),
        "name": faker.pet_first() + " " + faker.pet_last(),
        "species": species,
        "breed": breed,
        "sex": random.choice(list(Sex)).value,
        "age": round(age ,1),
        "ageClass": age_class.value,
        "size": size.value,
        "height": height,
        "weight": round(weight ,1),
        "description": faker.sentence(),
        "centerId": center_id,
    }

def generate_event(center_id: int):
    start_date = datetime.now() + timedelta(days=random.randint(1 ,30))
    end_date = start_date + timedelta(days=random.randint(1 ,7))

    return {
        'centerId': center_id,
        'datePosted': datetime.now().isoformat(),
        'name': f'Event for {center_id}',
        'description': faker.sentence(),
        'dateStart': start_date.isoformat(),
        'dateEnd': end_date.isoformat()
     }

def api_post(endpoint: str, data: json):
    print(f"Sending request to {API_BASE_URL}/{endpoint}")
    response = requests.post(f"{API_BASE_URL}/{endpoint}", json=data)
    response.raise_for_status()
    return response.json()

def api_get(endpoint):
    response = requests.get(f"{API_BASE_URL}/{endpoint}")
    response.raise_for_status()
    return response.json()

def pretty_print_json(data):
    print(json.dumps(data, indent=2, ensure_ascii=False))

def save_pretty_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

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

# Delete existing JSON files
for file in ["MOCK_CENTERS.json",
             "MOCK_OWNERS.json",
             "MOCK_PETS.json",
             "MOCK_EVENTS.json",
             "MOCK_PREFERENCES.json"]:
    if os.path.exists(file):
        os.remove(file)
        print(f"Deleted existing file: {file}")

# Generate sample data
num_centers = len(center_names_provider.elements)
num_owners = 50

adoption_centers = [generate_adoption_center() for _ in range(0, num_centers)]
potential_owners = [generate_potential_owner() for _ in range(0, num_owners)]

save_pretty_json(adoption_centers, "MOCK_CENTERS.json")
save_pretty_json(potential_owners, "MOCK_OWNERS.json")

for center in adoption_centers:
    print(f"Saving {center['name']}")
    response = api_post("api/centers", center)
    user_id = response['userid']
    
    # Generate some pets and events for this center
    for i in range(random.randint(5,10)):
        pets = [generate_pet(user_id) for _ in range(0, i)]
        events = [generate_event(user_id) for _ in range(0, i)]
        append_pretty_json(pets, "MOCK_PETS.json")
        append_pretty_json(events, "MOCK_EVENTS.json")
        for pet in pets:
            response = api_post("api/animals/", pet)
        for event in events:
            response = api_post("api/events/", event)


print("\n==================\n")

for owner in potential_owners:
    print(f"Saving {owner['nameFirst']} {owner['nameLast']}")
    response = api_post("api/owners", owner)
    user_id = response['userid']

    # Generate a preference for this user
    preference = generate_preference(user_id)
    append_pretty_json([preference], "MOCK_PREFERENCES.json")
    response = api_post(f"api/update/preferences/{user_id}", preference)

