WEBAPP_NAME:=expenses-webapp

set-up-development-environment:
	@echo ""
	@echo Installing git hooks...
	make install-dev-tools

	@echo ""
	@echo ""
	@echo Installing NPM dependencies outside of the container, to support pre-push builds...
	@# this step is necessary because otherwise docker-compose creates a node_modules
	@# folder with root permissions and outside-container build fails
	cd webapp; npm ci

	@echo ""
	@echo ""
	@echo Creating development docker images...
	make rebuild-webapp

	@echo ""
	@echo ""
	@echo To start app:  make run-full-stack

install-dev-tools:
	pre-commit install  # defaults to "pre-commit" stage
	pre-commit install --hook-type pre-push

uninstall-dev-tools:
	pre-commit uninstall  # defaults to "pre-commit" stage
	pre-commit uninstall --hook-type pre-push

run-webapp:
	scripts/print_local_ip_via_qr.sh
	docker-compose up $(WEBAPP_NAME)

run-webapp-mock-apis:
	scripts/print_local_ip_via_qr.sh
	REACT_APP_MOCK_APIS=true \
		docker-compose up $(WEBAPP_NAME)

# Recreate web app docker image
rebuild-webapp:
	docker-compose down
	docker image rm $(WEBAPP_NAME) || (echo "No $(WEBAPP_NAME) found, all good."; exit 0)
	docker-compose build --no-cache $(WEBAPP_NAME)

shell-webapp:
	docker-compose run --rm $(WEBAPP_NAME) bash

test-dev-webapp:
	docker-compose run --rm $(WEBAPP_NAME) npm test

deploy-webapp-from-local:
	cd ./webapp \
		&& npm run deploy_from_local
	@# TODO: docker-compose run --rm $(WEBAPP_NAME) npm run deploy_from_local

# Bundle webapp into the distribution folder
build-webapp:
	scripts/build_webapp.sh
