from datetime import datetime, timedelta
import random
from .config import faker, city_state_map, species_classifications, species_breeds
from .models import Sex, AgeClass, Size

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

