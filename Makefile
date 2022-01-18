run-webapp:
	scripts/print_local_ip_via_qr.sh
	docker-compose up expenses-webapp

# Recreate web app docker image
rebuild-webapp:
	docker-compose build expenses-webapp

shell-webapp:
	docker-compose run --rm expenses-webapp bash

deploy-webapp-from-local:
	cd ./webapp \
		&& npm run deploy_from_local
	@# TODO: docker-compose run --rm expenses-webapp npm run deploy_from_local

build-webapp:
	scripts/build_webapp.sh
