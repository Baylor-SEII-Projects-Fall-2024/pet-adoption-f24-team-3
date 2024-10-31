import random
from faker import Faker
from faker.providers import DynamicProvider
from .models import Sex, AgeClass, Size

faker = Faker()

# Comment for non-deterministic generation
faker.seed_instance(420)
random.seed(69)

# Production
# API_BASE_URL = "http://35.184.141.85:8080"

# Development
API_BASE_URL = "http://localhost:8080"

# Cities and States for generation
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

