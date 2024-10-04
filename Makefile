build:
	docker compose -f docker-compose.yml up --build -d --remove-orphans 


up:
	docker compose -f docker-compose.yml up -d

down:
	docker compose -f docker-compose.yml down

down-v:
	docker compose -f docker-compose.yml down -v

show-logs:
	docker compose -f docker-compose.yml logs

# volume:
# 	docker volume inspect 

remove-images:
	docker image prune -f --all

remove-volumes:
	docker volume prune -f 