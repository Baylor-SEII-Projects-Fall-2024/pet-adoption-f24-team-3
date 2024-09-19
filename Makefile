#!/usr/bin/make -f

# Author: Icko Iben
# Date Created: 09/10/2024
# Version: 1.0.0-SNAPSHOT
#
# Version History
# 09/10/2024
#   start-db, stop-db, clear-db, get-dependencies added
#
# TODO: figure out recursive make
# TODO: load everything into a docker container instead of running locally

COMPOSE_CMD := docker compose -f
COMPOSE_YML := docker/local.docker-compose.yml
# Evaluates to:
# MAKE := /Library/Developer/CommandLineTools/usr/bin/make

.PHONY: help
help: ## Help function
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


# Database Targets
.PHONY: start-db, stop-db, clear-db, get-dependencies

start-db: ## Start database
	$(COMPOSE_CMD) $(COMPOSE_YML) up -d

stop-db: ## Stop database
	$(COMPOSE_CMD) $(COMPOSE_YML) down

clear-db: ## Clear database
	$(COMPOSE_CMD) $(COMPOSE_YML) down -v

get-dependencies: ## Get gradle dependencies
	gradle --refresh-dependencies

## Back-end API
## TODO: figure out recursive make

API_DIR := pet-adoption-api


## React front-end

REACT_DIR := pet-adoption-frontend
