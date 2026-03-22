.PHONY: dev install

install:
	@echo "Installing backend dependencies..."
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
		echo "Please update the .env file with your API keys."; \
	else \
		echo ".env file already exists, skipping creation."; \
	fi
	@echo "Installation complete!"

dev:
	@echo "Starting development servers..."
	@echo "Backend will run on http://localhost:8000"
	@echo "Frontend will run on http://localhost:5173"
	@make -j 2 dev-backend dev-frontend

dev-backend:
	cd backend && if [ ! -d "venv" ]; then python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt; fi
	cd backend && source venv/bin/activate && uvicorn src.api.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev
