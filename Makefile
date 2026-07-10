# ==============================================================================
# 🚀 🎥 Backdrop Studio — Makefile
# ==============================================================================
# Description : Local development management and automated VPS deployment.
# Version     : 1.0.0
# Author      : Éole <hi@eole.me>
# License     : MIT
# ==============================================================================

# ⚙️ INFRASTRUCTURE VARIABLES (SECURED)
VPS_SSH              := eole.me
VPS_PROJECT_NAME     := $(shell git config --get remote.origin.url | sed 's/.*\///; s/\.git$$//')
VPS_PROJECT_TAG      := $(shell git rev-parse --short HEAD 2>/dev/null || echo "dev")
VPS_PATH             := /home/eole/projects/$(VPS_PROJECT_NAME)

PROJECT_NAME         := $(shell echo $(VPS_PROJECT_NAME) | cut -d'-' -f1 | sed 's/./\u&/')
VERSION              := $(shell node -p "require('./package.json').version" 2>/dev/null || echo "1.0.0")

# 🔑 SECRETS MANAGEMENT (DOPPLER)
DOPPLER_PROJECT     := eole-me
DOPPLER_CONFIG_DEV  := dev_$(DOPPLER_PROJECT)-$(shell echo $(PROJECT_NAME) | tr '[:upper:]' '[:lower:]')
DOPPLER_CONFIG_PROD := prd_$(DOPPLER_PROJECT)-$(shell echo $(PROJECT_NAME) | tr '[:upper:]' '[:lower:]')

# Find doppler binary (robust check for WSL non-interactive paths)
DOPPLER := $(shell which doppler 2>/dev/null || ( [ -f $(HOME)/bin/doppler ] && echo $(HOME)/bin/doppler ) || echo doppler)

# 🎨 COLOR CODES FOR MODERN HELP MENU (TrueColor ANSI)
GREEN     := \033[38;2;74;222;128m
BLUE      := \033[38;2;96;165;250m
PURPLE    := \033[38;2;167;139;250m
CYAN      := \033[38;2;45;212;191m
ORANGE    := \033[38;2;251;146;60m
GRAY      := \033[38;2;156;163;175m
DARK_GRAY := \033[38;2;75;85;99m
BOLD      := \033[1m
RESET     := \033[0m

# Semantic Typology mappings (Meta-colorization)
STYLE_TITLE       ?= $(CYAN)
STYLE_SECTION     ?= $(PURPLE)
STYLE_PHASE       ?= $(CYAN)
STYLE_DISCREET    ?= $(GRAY)
STYLE_INSTRUCTION ?= $(GREEN)
STYLE_RESULT      ?= $(GREEN)
STYLE_WARNING     ?= $(ORANGE)
STYLE_ERROR       ?= $(ORANGE)


# 🛠️ LOCAL DOCKER CONFIGURATION
DOCKER_DIR   := docker
COMPOSE_DEV  := $(DOCKER_DIR)/docker-compose.yml
COMPOSE_PROD := $(DOCKER_DIR)/docker-compose.prod.yml
# List of Docker production services (space separated, leave empty to deploy all services)
DOCKER_SERVICES := 

.PHONY: help configure dev dev-up dev-down up down restart deploy _deploy deploy-delay checklogs check-logs n8n-backup n8n-push n8n-backup-dev n8n-push-dev

# ==============================================================================
# ℹ️ HELP MENU
# ==============================================================================
help:
	@printf "  $(STYLE_TITLE)┌───────────────────────────────────────────────────────────┐$(RESET)\n"
	@printf "  $(STYLE_TITLE)│$(RESET)     🍃 $(BOLD)$(STYLE_TITLE)$(PROJECT_NAME)$(RESET) $(STYLE_SECTION)🍃 - stack COMMANDS$(RESET)                    $(STYLE_TITLE)│$(RESET)\n"
	@printf "  $(STYLE_TITLE)└───────────────────────────────────────────────────────────┘$(RESET)\n"
	@printf "\n"
	@printf "  $(BOLD)$(STYLE_SECTION)❯ Configuration & Setup:$(RESET)\n"
	@printf "    $(STYLE_INSTRUCTION)make configure$(RESET)            $(STYLE_DISCREET)•$(RESET) Run system configuration and env setup\n"
	@printf "\n"
	@printf "  $(BOLD)$(STYLE_SECTION)❯ Local Development (WSL Localhost):$(RESET)\n"
	@printf "    $(STYLE_INSTRUCTION)make dev$(RESET)                  $(STYLE_DISCREET)•$(RESET) Start local environment directly (loads/downloads .env)\n"
	@printf "    $(STYLE_INSTRUCTION)make up$(RESET)                   $(STYLE_DISCREET)•$(RESET) Start local dev Docker containers\n"
	@printf "    $(STYLE_INSTRUCTION)make down$(RESET)                 $(STYLE_DISCREET)•$(RESET) Stop local dev Docker containers\n"
	@printf "    $(STYLE_INSTRUCTION)make restart$(RESET)              $(STYLE_DISCREET)•$(RESET) Restart local dev Docker containers (down && up)\n"
	@printf "\n"
	@printf "  $(BOLD)$(STYLE_SECTION)❯ Production Deployment (VPS - $(PROJECT_NAME) on $(VPS_SSH)):$(RESET)\n"
	@printf "    $(STYLE_INSTRUCTION)make deploy$(RESET)               $(STYLE_DISCREET)•$(RESET) Push production compose & pull/recreate containers\n"
	@printf "    $(STYLE_INSTRUCTION)make deploy-delay$(RESET)         $(STYLE_DISCREET)•$(RESET) Wait 150s for GitHub Actions build and then deploy\n"
	@printf "    $(STYLE_INSTRUCTION)make checklogs$(RESET)            $(STYLE_DISCREET)•$(RESET) Fetch real-time production logs from VPS\n"
	@printf "  $(STYLE_DISCREET)────────────────────────────────────────────────────────────$(RESET)\n"

# ==============================================================================
# 🛠️ SETUP & SYSTEM CONFIGURATION
# ==============================================================================
configure:
	@if [ -f configure ]; then \
		bash configure; \
	else \
		echo "ℹ️ No configure script found for $(PROJECT_NAME)."; \
	fi

# ==============================================================================
# 💻 LOCAL DEVELOPMENT COMMANDS
# ==============================================================================
dev:
	@if [ ! -f .env ]; then \
		if $(DOPPLER) --version >/dev/null 2>&1; then \
			printf "  $(STYLE_PHASE)🔑$(RESET)  $(BOLD)Downloading development secrets from Doppler ($(DOPPLER_PROJECT))...$(RESET)\n"; \
			$(DOPPLER) secrets download --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_DEV) --no-file --format env > .env; \
		else \
			printf "  $(STYLE_WARNING)⚠️$(RESET)  $(BOLD)Doppler CLI not found. Copying $(DOCKER_DIR)/.env.example as .env fallback...$(RESET)\n"; \
			cp $(DOCKER_DIR)/.env.example .env 2>/dev/null || cp .env.example .env 2>/dev/null || printf "  $(STYLE_ERROR)❌$(RESET)  $(BOLD)No .env.example found!$(RESET)\n"; \
		fi \
	fi
	@if grep -q "dev" package.json 2>/dev/null; then \
		npm run dev; \
	else \
		printf "  $(STYLE_DISCREET)ℹ️$(RESET)  $(BOLD)No npm dev script found.$(RESET)\n"; \
	fi

dev-up:
	@printf "  $(STYLE_TITLE)✨$(RESET)  $(BOLD)Starting local development environment...$(RESET)\n"
	@if [ ! -f .env ]; then \
		if $(DOPPLER) --version >/dev/null 2>&1; then \
			printf "  $(STYLE_PHASE)🔑$(RESET)  $(BOLD)Downloading development secrets from Doppler ($(DOPPLER_PROJECT))...$(RESET)\n"; \
			$(DOPPLER) secrets download --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_DEV) --no-file --format env > .env; \
		else \
			printf "  $(STYLE_WARNING)⚠️$(RESET)  $(BOLD)Doppler CLI not found. Copying $(DOCKER_DIR)/.env.example as .env fallback...$(RESET)\n"; \
			cp $(DOCKER_DIR)/.env.example .env 2>/dev/null || cp .env.example .env 2>/dev/null || printf "  $(STYLE_ERROR)❌$(RESET)  $(BOLD)No .env.example found!$(RESET)\n"; \
		fi \
	fi
	docker compose -f $(COMPOSE_DEV) --env-file .env up -d
	@printf "  $(STYLE_RESULT)🚀$(RESET)  $(BOLD)$(PROJECT_NAME) ($(VERSION) / $(VPS_PROJECT_TAG)) is ready locally!$(RESET)\n"

dev-down:
	@printf "  $(STYLE_WARNING)🛑$(RESET)  $(BOLD)Stopping local development container...$(RESET)\n"
	@if [ -f .env ]; then \
		docker compose -f $(COMPOSE_DEV) --env-file .env down; \
	else \
		docker compose -f $(COMPOSE_DEV) down; \
	fi

up: dev-up
down: dev-down
restart: down up

# ==============================================================================
# 🚀 AUTOMATED DEPLOYMENT PIPELINE (VPS)
# ==============================================================================
deploy:
	@$(MAKE) --no-print-directory _deploy SERVICES="$(DOCKER_SERVICES)"

_deploy:
	@printf "  $(STYLE_PHASE)🚀$(RESET)  $(BOLD)[1/4] Preparing deployment space on VPS $(VPS_SSH)...$(RESET)\n"
	@ssh $(VPS_SSH) "mkdir -p $(VPS_PATH)" >/dev/null
	@printf "  $(STYLE_PHASE)📦$(RESET)  $(BOLD)[2/4] Uploading static assets and configuration files...$(RESET)\n"
	@scp $(COMPOSE_PROD) $(VPS_SSH):$(VPS_PATH)/docker-compose.prod.yml >/dev/null
	@printf "  $(STYLE_PHASE)🔑$(RESET)  $(BOLD)[3/4] Streaming production secrets from Doppler...$(RESET)\n"
	@if $(DOPPLER) --version >/dev/null 2>&1; then \
		if $(DOPPLER) secrets download --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_PROD) --no-file --format env > docker/.env.prod.temp 2>/dev/null || $(DOPPLER) secrets download --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_PROD) --no-file --format env > .env.prod.temp; then \
			[ -f docker/.env.prod.temp ] && scp docker/.env.prod.temp $(VPS_SSH):$(VPS_PATH)/.env >/dev/null && rm -f docker/.env.prod.temp || true; \
			[ -f .env.prod.temp ] && scp .env.prod.temp $(VPS_SSH):$(VPS_PATH)/.env >/dev/null && rm -f .env.prod.temp || true; \
		else \
			printf "  $(STYLE_ERROR)❌$(RESET)  $(BOLD)Error: Doppler secrets download failed for project $(DOPPLER_PROJECT) (config: $(DOPPLER_CONFIG_PROD))!$(RESET)\n"; \
			rm -f docker/.env.prod.temp .env.prod.temp 2>/dev/null; \
			exit 1; \
		fi; \
	else \
		printf "  $(STYLE_ERROR)❌$(RESET)  $(BOLD)Error: Doppler CLI is not installed or not found in PATH!$(RESET)\n"; \
		exit 1; \
	fi
	@printf "  $(STYLE_PHASE)🐳$(RESET)  $(BOLD)[4/4] Recreating and starting production containers...$(RESET)\n"
	@if [ "$(SERVICES)" = "" ]; then \
		ssh $(VPS_SSH) "cd $(VPS_PATH) && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d --remove-orphans" >/dev/null; \
	else \
		ssh $(VPS_SSH) "cd $(VPS_PATH) && docker compose -f docker-compose.prod.yml pull $(SERVICES) && docker compose -f docker-compose.prod.yml up -d --remove-orphans" >/dev/null; \
	fi
	@printf "  $(STYLE_RESULT)✅$(RESET)  $(BOLD)Deployment of $(PROJECT_NAME) [$(VERSION) / $(VPS_PROJECT_TAG)] successfully completed on production server!$(RESET)\n"

checklogs: check-logs

check-logs:
	@printf "  $(STYLE_PHASE)📟$(RESET)  $(BOLD)Fetching real-time production logs from VPS [$(VPS_SSH)]...$(RESET)\n"
	ssh $(VPS_SSH) "cd $(VPS_PATH) && docker compose -f docker-compose.prod.yml logs -f"

deploy-delay:
	@printf "  $(STYLE_PHASE)⏳$(RESET)  $(BOLD)Waiting 150 seconds for GitHub Actions build to complete...$(RESET)\n"
	git push && sleep 150 && $(MAKE) --no-print-directory deploy

# ==============================================================================
# 🔄 N8N SYNC COMMANDS (IF APPLICABLE)
# ==============================================================================
# Path to the sync script relative to the project root
N8N_SYNC_SCRIPT := toolkit/sync_n8n.py

n8n-backup:
	@if [ -f $(N8N_SYNC_SCRIPT) ]; then \
		if $(DOPPLER) --version >/dev/null 2>&1; then \
			printf "  $(STYLE_PHASE)🔑$(RESET)  $(BOLD)Streaming production secrets via Doppler to python sync tool...$(RESET)\n"; \
			$(DOPPLER) run --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_PROD) -- python3 $(N8N_SYNC_SCRIPT) --backup-all; \
		else \
			python3 $(N8N_SYNC_SCRIPT) --backup-all; \
		fi; \
	else \
		printf "  $(STYLE_DISCREET)ℹ️$(RESET)  $(BOLD)Sync script not found at $(N8N_SYNC_SCRIPT)$(RESET)\n"; \
	fi

n8n-push:
	@if [ -f $(N8N_SYNC_SCRIPT) ]; then \
		if $(DOPPLER) --version >/dev/null 2>&1; then \
			printf "  $(STYLE_PHASE)🔑$(RESET)  $(BOLD)Streaming production secrets via Doppler to python sync tool...$(RESET)\n"; \
			$(DOPPLER) run --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_PROD) -- python3 $(N8N_SYNC_SCRIPT) --push-all; \
		else \
			python3 $(N8N_SYNC_SCRIPT) --push-all; \
		fi; \
	else \
		printf "  $(STYLE_DISCREET)ℹ️$(RESET)  $(BOLD)Sync script not found at $(N8N_SYNC_SCRIPT)$(RESET)\n"; \
	fi

n8n-backup-dev:
	@if [ -f $(N8N_SYNC_SCRIPT) ]; then \
		if $(DOPPLER) --version >/dev/null 2>&1; then \
			printf "  $(STYLE_PHASE)🔑$(RESET)  $(BOLD)Streaming development secrets via Doppler to python sync tool...$(RESET)\n"; \
			$(DOPPLER) run --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_DEV) -- python3 $(N8N_SYNC_SCRIPT) --backup-all --dev; \
		else \
			python3 $(N8N_SYNC_SCRIPT) --backup-all --dev; \
		fi; \
	else \
		printf "  $(STYLE_DISCREET)ℹ️$(RESET)  $(BOLD)Sync script not found at $(N8N_SYNC_SCRIPT)$(RESET)\n"; \
	fi

n8n-push-dev:
	@if [ -f $(N8N_SYNC_SCRIPT) ]; then \
		if $(DOPPLER) --version >/dev/null 2>&1; then \
			printf "  $(TYPO_PHASE)🔑$(RESET)  $(BOLD)Streaming development secrets via Doppler to python sync tool...$(RESET)\n"; \
			$(DOPPLER) run --project $(DOPPLER_PROJECT) --config $(DOPPLER_CONFIG_DEV) -- python3 $(N8N_SYNC_SCRIPT) --push-all --dev; \
		else \
			python3 $(N8N_SYNC_SCRIPT) --push-all --dev; \
		fi; \
	else \
		printf "  $(TYPO_DISCREET)ℹ️$(RESET)  $(BOLD)Sync script not found at $(N8N_SYNC_SCRIPT)$(RESET)\n"; \
	fi
