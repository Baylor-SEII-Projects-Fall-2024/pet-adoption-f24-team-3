# Generating Mock Data and Populating Our Database

`generate.py` is a simple python script that seeds our database with
somewhat realistic values. 

1.  [Running the Script](#running-the-script)
1.  [Resetting the Database](#resetting-the-database)
    1. [On `localhost`](#on-localhost)
    1. [On Production](#on-production)
1.  [About This Script](#about-this-script)
    1.  [Random Value Generation](#random-value-generation)
    1.  [Changing The Amount of Generated Values](#changing-the-amount-of-generated-values)
1.  [TODO](#todo)

---

## Running the Script

[back to top](#generating-mock-data-and-populating-our-database)

Load the python virtual environment, download dependencies, and run the script.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 generate.py <environment> <size>
```

Valid Environments

| Environment | Desc |
| --- | --- |
| `local` | localhost |
| `prod` | Production runner |
| `backup` | Backup runner |
| `dev` | Development runner |

Valid Sizes

* `small` or `s`
* `medium` or `m`
* `large` or `l`

---

## Resetting the Database

### On `localhost`

[back to top](#generating-mock-data-and-populating-our-database)

While the backend is still running, clear all existing tables and remove
uploads directories from the api directory. This can be done by running
the following script.

***USE THIS SCRIPT WITH EXTREME CAUTION***

***DOUBLE CHECK YOU ARE USING THE LOCALHOST URL***

```bash
python3 clear-db.py <environment>
```

See above for valid environment calls.

If on local host, you may have to stop the database, clear it, then restart it.

```bash
COMPOSE_CMD := docker compose -f
COMPOSE_YML := docker/local.docker-compose.yml
# Stop the db
docker compose -f docker/local.docker-compose.yml down

# Clear the db
docker compose -f docker/local.docker-compose.yml down -v

# Restart the db
docker compose -f docker/local.docker-compose.yml up -d
```

After restarting the docker container, you may have to stop and restart
your backend api.

---

### On Production

[back to top](#generating-mock-data-and-populating-our-database)

1.  Change the URL in `clear-db.py` to the IP of the runner. **Double check
  this value**
1.  Go to [Google Cloud](console.cloud.google.com). Click the hamburger on the
  top left and navigate to Compute Engine > VM instances. SSH into your vm
  instance.
1.  List your docker containers by running `docker ps -a`
1.  The docker container name for the api should be `docker-api-1`. Navigate
  into this container by running `docker exec -it docker-api-1 bash`.
1.  Go back a directory, `cd ..`
1.  List all directories to locate `uploads`
1.  Delete uploads with `rm -r uploads`

---

## About This Script

[back to top](#generating-mock-data-and-populating-our-database)

This script generates random values to seed our database with, sends requests
to the api layer to add these to the database, and saves generated json objects
to files for logging purposes.

### File Structure

```
generate.py
modules/
 |_ __init__.py
 |_ config.py
 |_ generators.py
 |_ models.py
 |_ utils.py
 |_ static.py
clear-db.py
```

`generate.py`

Main script.

`modules/config.py`

Contains generatal configuration data. `API_BASE_URL`, `city_state_map`,
`center_names_provider`, pet name providers, `species_classifications`,
and `species_breeds`. These are all constant values that are used to
generate random values later.

`modules/generators.py`

Contains the actual generation logic for owners, centers, pets, events, and preferences.

`modules/models.py`

Contains enums for Sex, AgeClass, and Size.

`modules/utils.py`

Contains utility functions for getting, posting, and printing json data.

`modules/static.py`

Contains static owner and center accounts for developer use.

### Random Value Generation

[back to top](#generating-mock-data-and-populating-our-database)

This script uses a combination of python's built in `random` module and
the `Faker` module. `Faker` provides many different randomly generated
values, such as names, addresses, emails, and passwords. If we want to
specify a distinct range of values for `Faker` to choose from, we can
implements our own `DynamicProvider` instances. See `center_names_provider`
for an example. If we want `Faker` to randomly generate distinct values,
we can use the `unique` keyword to ensure that Faker only creates distinct
values for this session.

### Changing The Amount of Generated Values

[back to top](#generating-mock-data-and-populating-our-database)

In `generate.py` we can see variables defined for the number of each
instance to generate.

```py
# NUMBER OF GENERATIONS
num_centers = len(center_names_provider.elements)
num_owners = 50
min_pets_per_center = 10
max_pets_per_center = 20
min_events_per_center = 5
max_events_per_center = 10
```

The number of centers looks in our `center_names_provider` to see the amount
of defined names. It will generate a center for each of these names. If we
want more centers, then we can define additional centers in the `elements`
section of `center_names_provider`. If we want fewer centers, then we can
simply define a constant value in place of `len(center_names_provider.elements)`.

For each adoption center created, the script generates a random amount of
pets and events between `min_pets_per_center` and `max_pets_per_center` or
between `min_events_per_center` and `max_events_per_center`, respectively.

---

## TODO

[back to top](#generating-mock-data-and-populating-our-database)

* [x] Add Faker calls to create realistic data.
    * [x] First name, last name
    * [x] Pet name?
        * Used DynamicProvider
    * [x] Parse the faker returned address into street addr, city, state
    * [x] Preload specific center names.
        * Used DynamicProvider
* [x] Add non-random dev accounts so we don't have to make a new account
    everytime after clearing db
* [x] Randomly generate images

### Animal Image APIs

* <https://dog.ceo/dog-api/>
* <https://randomfox.ca/floof>
    * <https://randomfox.ca>
* <https://thecatapi.com/>
    * 10,000 requests per month
* <https://random-d.uk/api/quack>
    * <https://random-d.uk/api?ref=public_apis>
* <https://api.racc.lol/raccoon?json=true>
    * <https://racc.lol>
* <https://github.com/treboryx/snake-api>
* <https://some-random-api.com/animal/bird>
    * Also: bird, cat, dog, fox, kangaroo, koala, panda, red\_panda
    * returns a link to imgur in 'image' json tag

#### Sites that don't have API's but we can potentially scrape

* <https://www.bunnies.io/>

#### Sites that we won't be using but I still like

* <https://random.cat/meow>
* <https://random.dog/woof.json>
* <https://placebear.com/{width}/{height}>
    * <https://placebear.com/?ref=public_apis>

[back to top](#generating-mock-data-and-populating-our-database)
