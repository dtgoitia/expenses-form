run-webapp:
	docker-compose up expenses-webapp

# Recreate web app docker image
rebuild-webapp:
	docker-compose build expenses-webapp

shell-webapp:
	docker-compose run --rm expenses-webapp bash