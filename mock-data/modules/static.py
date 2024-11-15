# modules/static.py

def generate_static_accounts():
    static_centers = [
        {
            "accountType": "Center",
            "emailAddress": "iben.ixi@gmail.com",
            "password": "pass",
            "name": "Woof Adoption Center",
            "address": "123 Dev Street",
            "city": "Waco",
            "state": "TX",
            "zipCode": "76706",
            "description": "Woof Adoption Center wants you to come adopt some pets!"
        },
        {
            "accountType": "Center",
            "emailAddress": "testcenter@test.com",
            "password": "pass",
            "name": "Test Center",
            "address": "1234 Dev Street",
            "city": "Waco",
            "state": "TX",
            "zipCode": "76706",
            "description": "Test Center wants you to come adopt some pets!"
        }
    ]

    static_owners = [
        {
            "accountType": "Owner",
            "emailAddress": "ickoxii@gmail.com",
            "nameFirst": "Icko",
            "nameLast": "Iben",
            "password": "pass"
        },
        {
            "accountType": "Owner",
            "emailAddress": "testowner@test.com",
            "nameFirst": "Bojack",
            "nameLast": "Horseface",
            "password": "pass"
        }
    ]

    return static_centers, static_owners
