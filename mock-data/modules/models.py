# modules/models.py

from enum import Enum

class ImageType(Enum):
    PET = "pet"
    BANNER = "banner"
    CENTER = "center"
    OWNER = "owner"
    EVENT = "event"

class Sex(Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    NEUTERED_MALE="NEUTERED_MALE"
    SPAYED_FEMALE="SPAYED_FEMALE"


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
