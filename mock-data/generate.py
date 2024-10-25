import random
import json
from datetime import datetime, timedelta
from enum import Enum

# Set a fixed seed for reproducibility
random.seed(69)

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

def get_classification(value, ranges):
    for min_val, max_val, classification in ranges:
        if min_val <= value < max_val:
            return classification
    return ranges[-1][2]  # Return the last classification if value exceeds all ranges

def generate_adoption_center(id: int , name: str):
    return {
        "id": id,
        "accountType": "Center",
        "emailAddress": f"center{id}@example.com",
        "password": f"password{id}",
        "name": name,
        "address": f"{random.randint(1000 ,9999)} Main St",
        "city": random.choice(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]),
        "state": random.choice(["NY", "CA", "IL", "TX", "AZ"]),
        "zipCode": random.randint(10000 ,99999 ),
        "description": "A safe haven for homeless pets",
    }

def generate_potential_owner(id: int):
    return {
        "id": id,
        "accountType": "Owner",
        "emailAddress": f"owner{id}@example.com",
        "password": f"ownerpass{id}",
        "nameFirst": f"FirstName{id}",
        "nameLast": f"LastName{id}"
    }

def generate_animal_data(species: str):
    age = random.uniform(0 ,species_classifications[species]["age"][-1][1])
    weight = random.uniform(0 ,species_classifications[species]["size"][-1][1])
    height = random.randint(10 ,100) # Simplified height generation
    
    age_class = get_classification(age ,species_classifications[species]["age"])
    size = get_classification(weight ,species_classifications[species]["size"])
    
    return age ,age_class ,weight ,size ,height

def generate_preference(id: int ,center_id: int):
    species = random.choice(list(species_classifications.keys()))
    age ,age_class ,weight ,size ,height = generate_animal_data(species)
    
    return {
        "id": id,
        "date": (datetime.now() - timedelta(days=random.randint(0 ,365))).isoformat(),
        "name": f"Preference{id}",
        "species": species,
        "breed": f"{species}Breed{random.randint(1 ,5)}",
        "sex": random.choice(list(Sex)).value,
        "age": round(age ,1),
        "ageClass": age_class.value,
        "size": size.value,
        "height": height,
        "weight": round(weight ,1),
        "description": f"Description for Preference {id}",
        "centerId": center_id,
    }

def generate_pet(id: int ,center_id: int):
    species = random.choice(list(species_classifications.keys()))
    age ,age_class ,weight ,size ,height = generate_animal_data(species)
    
    return {
        "id": id,
        "date": (datetime.now() - timedelta(days=random.randint(0 ,365))).isoformat(),
        "name": f"Pet{id}",
        "species": species,
        "breed": f"{species}Breed{random.randint(1 ,5)}",
        "sex": random.choice(list(Sex)).value,
        "age": round(age ,1),
        "ageClass": age_class.value,
        "size": size.value,
        "height": height,
        "weight": round(weight ,1),
        "description": f"Description for Pet {id}",
        "centerId": center_id,
    }

def generate_event(id: int ,center_id: int):
    start_date = datetime.now() + timedelta(days=random.randint(1 ,30))
    end_date = start_date + timedelta(days=random.randint(1 ,7))
    
    return {
        'id': id,
         'centerId': center_id,
         'datePosted': datetime.now().isoformat(),
         'name': f'Event {id}',
         'description': f'Description for Event {id}',
         'dateStart': start_date.isoformat(),
         'dateEnd': end_date.isoformat()
     }

# Sample center names
center_names = [
     # Your list of center names...
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

# Generate sample data
num_centers = len(center_names) # Use the number of names in the list
num_owners = 10
num_preferences = 15
num_pets = 20
num_events = 10

adoption_centers = [generate_adoption_center(i + 1 ,name) for i,name in enumerate(center_names)]
potential_owners = [generate_potential_owner(i) for i in range(1,num_owners + 1)]
preferences = [generate_preference(i ,random.choice(adoption_centers)['id']) for i in range(1,num_preferences + 1)]
pets = [generate_pet(i ,random.choice(adoption_centers)['id']) for i in range(1,num_pets + 1)]
events = [generate_event(i ,random.choice(adoption_centers)['id']) for i in range(1,num_events + 1)]

# Save data to separate JSON files
def save_to_json(data: list ,filename: str):
    with open(filename ,'w') as f:
         json.dump(data,f ,indent=2)

save_to_json(adoption_centers ,'MOCK_CENTERS.json')
save_to_json(potential_owners ,'MOCK_USERS.json')
save_to_json(preferences ,'MOCK_PREFERENCES.json')
save_to_json(pets ,'MOCK_PETS.json')
save_to_json(events ,'MOCK_EVENTS.json')

print("Sample data has been generated and saved to separate JSON files.")

