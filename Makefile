.PHONY: help dev build start migrate migrate-dev seed studio test lint format docker-up docker-down clean

help: ## Mostrar este help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Rodar em modo desenvolvimento
	npm run dev

build: ## Instalar dependências
	npm install

start: ## Rodar em modo produção
	npm start

migrate: ## Aplicar migrations
	npm run migrate

migrate-dev: ## Criar nova migration
	npm run migrate:dev

seed: ## Popular banco com dados
	npm run seed

studio: ## Abrir Prisma Studio
	npm run studio

test: ## Rodar testes
	npm test

lint: ## Rodar linter
	npm run lint

format: ## Formatar código
	npm run format

docker-up: ## Subir containers (banco + API)
	docker-compose up -d

docker-down: ## Parar containers
	docker-compose down

docker-logs: ## Ver logs dos containers
	docker-compose logs -f

clean: ## Limpar node_modules e dist
	rm -rf node_modules dist

.DEFAULT_GOAL := help

