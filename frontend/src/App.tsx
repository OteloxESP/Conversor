import { useState } from 'react'
import './App.css'

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!url.trim()) {
      setError('Por favor, introduce una URL de YouTube')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Error del servidor: ${response.status}`)
      }

      // Descargar el archivo
      const blob = await response.blob()
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'audio.m4a'
      
      console.log('Content-Disposition header:', contentDisposition)
      
      if (contentDisposition) {
        const match = /filename="?([^"]+)"?/.exec(contentDisposition)
        console.log('Filename match:', match)
        if (match?.[1]) {
          filename = decodeURIComponent(match[1])
          console.log('Filename final:', filename)
        }
      }

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      setSuccess(true)
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>🎵 YouTube to Audio</h1>
        <p className="subtitle">Convierte videos de YouTube a audio</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button"
          >
            {loading ? 'Descargando...' : 'Descargar Audio'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">¡Descarga completada! ✓</div>}

        <div className="info">
          <p className="small">El servidor backend debe estar corriendo en <code>http://localhost:4000</code></p>
        </div>
      </div>
    </div>
  )
}
