# modules/static.py

def generate_static_accounts():
    static_centers = [
        {
            "accountType": "Center",
            "emailAddress": "iben.ixi@gmail.com",
            "password": "Passw0rd!",
            "name": "Woof Adoption Center",
            "address": "123 Dev Street",
            "city": "Waco",
            "state": "Texas",
            "zipCode": "76706",
            "description": "Woof Adoption Center wants you to come adopt some pets!"
        },
        {
            "accountType": "Center",
            "emailAddress": "testcenter@test.com",
            "password": "Passw0rd!",
            "name": "Test Center",
            "address": "1234 Dev Street",
            "city": "Waco",
            "state": "Texas",
            "zipCode": "76706",
            "description": "Test Center wants you to come adopt some pets!"
        },
        {
            "accountType": "Center",
            "emailAddress": "ffr@fuzzyfriendsrescue.com",
            "password": "Center@123",
            "name": "Fuzzy Friends Rescue",
            "address": "6321 Airport Road",
            "city": "Waco",
            "state": "Texas",
            "zipCode": "76708",
            "description": "Come adopt some pets at Fuzzy Friends Rescue!"
        }
    ]

    static_owners = [
        {
            "accountType": "Owner",
            "emailAddress": "ickoxii@gmail.com",
            "nameFirst": "Icko",
            "nameLast": "Iben",
            "password": "Passw0rd!"
        },
        {
            "accountType": "Owner",
            "emailAddress": "testowner@test.com",
            "nameFirst": "Bojack",
            "nameLast": "Horseface",
            "password": "Passw0rd!"
        }
    ]

    return static_centers, static_owners
