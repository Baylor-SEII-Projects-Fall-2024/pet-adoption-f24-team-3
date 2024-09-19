#!/usr/bin/make -f

# author: Icko Iben
# date created: 09/11/2024
# version: 1.0.0-SNAPSHOT

VERSION:=1.0.0-SNAPSHOT
JAR_BASE:=pet-adoption-api
JAR_DIR:=build/libs

.PHONY: help
help: ## Help function
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: build, test, run, run-plain, clean

build: ## Build project
	./gradlew build

test: ## Run tests
	./gradlew test

run: ## Run jar
	java -jar $(JAR_DIR)/$(JAR_BASE)-$(VERSION).jar

run-plain: ## Run plain jar
	java -jar $(JAR_DIR)/$(JAR_BASE)-$(VERSION)-plain.jar

clean: ## Clean artifacts
	./gradlew clean
