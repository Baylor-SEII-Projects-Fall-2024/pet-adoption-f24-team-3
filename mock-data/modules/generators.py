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
        "emailAddress": f"{email_name}@center.com",
        "password": faker.password(),
        "name": center_name,
        "address": faker.unique.street_address(),
        "city": city,
        "state": state,
        "zipCode": faker.postcode(),
        "description": faker.paragraph(),
    }

def generate_potential_owner():
    nameFirst = faker.first_name()
    nameLast = faker.last_name()
    id = faker.unique.random_number(digits=9)
    domain = faker.domain_name()
    email = f"{nameFirst[0].lower()}{nameLast.lower()}{id}@{domain}"

    return {
        "accountType": "Owner",
        "emailAddress": email,
        "nameFirst": nameFirst,
        "nameLast": nameLast,
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

    # species_names e.g. Cat
    # event_actions e.g. Adoption
    # event_types e.g. Extravaganza
    # event_themes e.g. Space
    name_type = random.choice([1, 2, 3])
    if name_type == 1:
        event_name = f"{faker.species_names()} {faker.event_actions()} {faker.event_types()}"
    elif name_type == 2:
        event_name = f"{faker.event_themes()} {faker.species_names()} {faker.event_actions()}"
    elif name_type == 3:
        event_name = f"{faker.event_actions()} {faker.event_types()} for {faker.species_names()}s"

    return {
        'centerId': center_id,
        'datePosted': datetime.now().isoformat(),
        'name': event_name,
        'description': faker.sentence(),
        'dateStart': start_date.isoformat(),
        'dateEnd': end_date.isoformat()
     }

