# syntax=docker/dockerfile:1

FROM python:3.13-slim AS base

WORKDIR /app

# Etapa de construcción: instalar dependencias en un venv
FROM base AS builder

# Instalar dependencias de compilación si son necesarias (ej. gcc, build-essential, etc.)
# Por ahora asumimos dependencias Python puras, así que omitimos deps extras de compilación

# Crear entorno virtual e instalar dependencias
RUN python -m venv .venv

# Copiar requirements.txt e instalar dependencias usando caché de pip
COPY --link requirements.txt ./
ENV PIP_CACHE_DIR=/root/.cache/pip
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    .venv/bin/pip install --upgrade pip && \
    .venv/bin/pip install -r requirements.txt

# Etapa final: copiar código de la app y venv, configurar usuario sin privilegios
FROM base AS final

# Crear usuario y grupo sin privilegios
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copiar entorno virtual desde el builder
COPY --from=builder /app/.venv /app/.venv

# Copiar código de la aplicación (excluyendo .git, .env, etc. vía .dockerignore)
COPY --link app.py ./

# Configurar el entorno para usar venv
ENV PATH="/app/.venv/bin:$PATH"

USER appuser

CMD ["python", "app.py"]
