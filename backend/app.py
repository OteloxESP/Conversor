from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pytubefix import YouTube
import io

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # Exponer el header para que el frontend pueda leerlo
)

class ConvertRequest(BaseModel):
    url: str

@app.get('/health')
async def health():
    return {
        'status': 'ok',
        'message': 'Backend funcionando correctamente'
    }

@app.post('/convert')
async def convert(request: ConvertRequest):
    try:
        url = request.url
        
        if not url:
            raise HTTPException(status_code=400, detail='URL es requerida')
        
        print(f'📥 Procesando: {url}')
        
        # Usar pytubefix para descargar solo audio
        yt = YouTube(url)
        
        # Obtener título
        title = yt.title
        clean_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).strip()[:100]
        if not clean_title:  # Si el título queda vacío después de limpiar
            clean_title = "audio"
        
        print(f'🎵 Título original: {title}')
        print(f'📝 Título limpio: {clean_title}')
        print(f'🔄 Descargando audio...')
        
        # Obtener el stream de audio con mejor calidad
        audio_stream = yt.streams.filter(only_audio=True, file_extension='mp4').order_by('abr').desc().first()
        
        if not audio_stream:
            raise HTTPException(status_code=500, detail='No se encontró stream de audio disponible')
        
        # Descargar a memoria
        buffer = io.BytesIO()
        audio_stream.stream_to_buffer(buffer)
        buffer.seek(0)
        
        print(f'✅ Descarga completada: {clean_title}')
        
        # Retornar como stream (formato m4a/mp4 audio, compatible con reproductores)
        return StreamingResponse(
            buffer,
            media_type='audio/mp4',
            headers={
                'Content-Disposition': f'attachment; filename="{clean_title}.m4a"'
            }
        )
        
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        raise HTTPException(
            status_code=500,
            detail=f'Error en la conversión: {str(e)}'
        )



if __name__ == '__main__':
    import uvicorn
    print('🚀 Backend FastAPI iniciado en http://localhost:4000')
    uvicorn.run(app, host='0.0.0.0', port=4000)
