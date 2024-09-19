#!/usr/bin/make -f

# author: Icko Iben
# date created: 09/10/2024
# version: 1.0.0-SNAPSHOT

.PHONY: help
help: ## Help function
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: get-dependencies, start-dev, build-prod, start-prod

get-dependencies: ## Install dependencies
	yarn install

start-dev: ## Start development server
	yarn dev

build-prod:
	yarn build

start-prod: build-prod ## Start production server
	yarn start
