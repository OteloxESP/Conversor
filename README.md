# Conversor YouTube a Audio

Aplicación web para descargar audio de videos de YouTube. Proyecto de portfolio construido con React + TypeScript (frontend) y Python + FastAPI (backend).

## 🎯 Características

- ✅ Interfaz moderna con React + TypeScript
- ✅ Descarga de audio de YouTube en formato M4A (alta calidad)
- ✅ Feedback visual (loading, errores, éxito)
- ✅ Backend robusto con FastAPI + pytubefix

## 📁 Estructura del Proyecto

```
conversor/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx   # Componente principal
│   │   ├── App.css   # Estilos
│   │   └── main.tsx  # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           # FastAPI + Python
│   ├── app.py        # Servidor FastAPI y endpoint /convert
│   └── requirements.txt
│
└── README.md
```

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado) 🐳

**Requisitos:**
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)

**Pasos:**

1. **Construir y levantar los servicios:**
```bash
docker compose up -d
```

2. **Acceder a la aplicación:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

3. **Ver logs (opcional):**
```bash
docker compose logs -f
```

4. **Parar los servicios:**
```bash
docker compose down
```

---

### Opción 2: Instalación Manual

### Requisitos previos

- **Frontend:** Node.js 18+ y npm
- **Backend:** Python 3.8+ y pip

### 1. Instalar dependencias

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 2. Ejecutar el proyecto

Necesitas **dos terminales** abiertas:

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```
El backend se ejecutará en `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
El frontend se ejecutará en `http://localhost:5173`

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Fetch API** - Llamadas HTTP al backend
- **CSS moderno** - Estilos con gradientes y animaciones

### Backend
- **FastAPI** - Framework web moderno y asíncrono
- **Python 3** - Lenguaje de backend
- **pytubefix** - Librería Python pura para descargar de YouTube (sin dependencias externas)
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **CORS** - Configuración cross-origin para desarrollo

## 📝 Endpoints del Backend

### `POST /convert`
Descarga el audio de una URL de YouTube.

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Respuesta:**
- Stream del archivo de audio en formato M4A
- Header `Content-Disposition` con el nombre del video
- Header `Content-Type: audio/mp4`

**Ejemplo de uso con cURL:**
```bash
curl -X POST http://localhost:4000/convert \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}' \
  --output audio.m4a
```

### `GET /health`
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Backend funcionando correctamente"
}
```

## 🐛 Troubleshooting

### Usando Docker

**Los contenedores no arrancan:**
```bash
# Ver el estado de los contenedores
docker compose ps

# Ver logs para identificar el error
docker compose logs -f backend
docker compose logs -f frontend
```

**Puerto ya en uso:**
Si los puertos 4000 o 5173 ya están ocupados, edita `compose.yaml`:
```yaml
ports:
  - "NUEVO_PUERTO:4000"  # Cambia NUEVO_PUERTO por ej: 8000
```

**Reconstruir después de cambios en el código:**
```bash
docker compose down
docker compose build
docker compose up -d
```

**Limpiar todo (contenedores, imágenes, volúmenes):**
```bash
docker compose down --rmi all --volumes
```

---

### Instalación Manual

### Error de CORS
Asegúrate de que:
- El backend esté ejecutándose en `http://localhost:4000`
- El frontend esté ejecutándose en `http://localhost:5173`
- Ambos servidores estén activos simultáneamente

### Pytubefix falla al descargar
Si YouTube cambia su API, actualiza pytubefix:
```bash
pip install --upgrade pytubefix
```

## 📦 Build para Producción

### Con Docker (Recomendado)

Las imágenes de Docker ya están optimizadas para producción:

```bash
# Construir imágenes de producción
docker compose build

# Levantar en producción
docker compose up -d

# Las imágenes incluyen:
# - Frontend: Build de Vite + Nginx (optimizado)
# - Backend: Python + uvicorn con usuario sin privilegios
```

### Build Manual

**Frontend:**
```bash
cd frontend
npm run build
# Los archivos estáticos estarán en frontend/dist/
```

**Backend:**
```bash
cd backend
# Para producción, usa Gunicorn con workers de Uvicorn
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:4000
```



