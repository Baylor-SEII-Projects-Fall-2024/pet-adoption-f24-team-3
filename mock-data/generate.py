import os
from modules.config import API_BASE_URL, faker, random, center_names_provider
from modules.models import Sex, AgeClass, Size
from modules.generators import (
    generate_adoption_center,
    generate_potential_owner,
    generate_pet,
    generate_event,
    generate_preference
)
from modules.static import generate_static_accounts
from modules.utils import api_post, api_get, api_post_img
from modules.utils import save_pretty_json, append_pretty_json, pretty_print_json
from modules.images import generate_image, ImageType, generate_animal_image


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

# NUMBER OF GENERATIONS
num_centers = len(center_names_provider.elements)
num_owners = 50
min_pets_per_center = 10
max_pets_per_center = 20
min_events_per_center = 5
max_events_per_center = 10

# Small batch generation for testing
# num_centers = 5
# num_owners = 5
# min_pets_per_center = 5
# max_pets_per_center = 5
# min_events_per_center = 5
# max_events_per_center = 5

# Generate static values
static_centers, static_owners = generate_static_accounts()

adoption_centers = static_centers.copy()
potential_owners = static_owners.copy()

# Generate random values
adoption_centers.extend([generate_adoption_center() for _ in range(0, num_centers)])
potential_owners.extend([generate_potential_owner() for _ in range(0, num_owners)])

save_pretty_json(adoption_centers, "MOCK_CENTERS.json")
save_pretty_json(potential_owners, "MOCK_OWNERS.json")

for owner in potential_owners:
    print(f"Saving {owner['nameFirst']} {owner['nameLast']}")
    response = api_post("api/owners", owner)
    user_id = response['userid']

    response = api_post_img(f"api/images/users/{user_id}/profile", generate_image(ImageType.OWNER, user_id))

    # Generate a preference for this user
    preference = generate_preference(user_id)
    print(f"Saving preference to {owner['nameFirst']} {owner['nameLast']}")
    append_pretty_json([preference], "MOCK_PREFERENCES.json")
    api_post(f"api/update/preferences/{user_id}", preference)

print("\n==========\n")

for center in adoption_centers:
    print("\n==========\n")

    print(f"Saving {center['name']}")
    response = api_post("api/centers", center)
    user_id = response['userid']
    
    # Generate some pets and events for this center
    num_pets = random.randint(min_pets_per_center, max_pets_per_center)
    num_events = random.randint(min_events_per_center, max_events_per_center)

    pets = [generate_pet(user_id) for _ in range(num_pets)]
    events = [generate_event(user_id) for _ in range(num_events)]
    append_pretty_json(pets, "MOCK_PETS.json")
    append_pretty_json(events, "MOCK_EVENTS.json")

    response = api_post_img(f"api/images/users/{user_id}/profile", generate_image(ImageType.CENTER, user_id))
    response = api_post_img(f"api/images/users/{user_id}/banner", generate_image(ImageType.BANNER, user_id))

    for pet in pets:
        print(f"  Saving pet {pet['name']} to {center['name']}")
        response = api_post("api/animals/", pet)
        pet_id = response['id']

        try:
            img_url = generate_animal_image(pet['species'], pet['breed'], pet_id)
            if img_url:
                response = api_post_img(f"api/images/animals/{pet_id}", img_url)
                print(f"    Successfully added image for pet {pet_id}")
            else:
                print(f"    No image generated for pet {pet_id}")
        except Exception as e:
            print(f"    Failed to generate image {pet_id}")
            continue # Skip to next pet

    for event in events:
        print(f"  Saving event {event['name']} to {center['name']}")
        response = api_post("api/events/", event)
        event_id = response['eventID']
        response = api_post_img(f"api/images/events/{event_id}", generate_image(ImageType.EVENT, event_id))
