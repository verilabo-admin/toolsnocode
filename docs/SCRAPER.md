# Scraper

Servicio Python que alimenta las tablas `tools`, `experts` y `tutorials` desde fuentes externas. Vive fuera del repo del frontend, en `../scraper/` del proyecto local, y **no está versionado** — se ejecuta manualmente cuando se quiere refrescar el catálogo.

## Fuentes

- **Tools**: `futurepedia.io` (sitemap + páginas de detalle).
- **Experts** y **Tutorials**: mismas fuentes vía endpoints API secundarios.

## Dependencias

Declaradas en `requirements.txt`:

- `requests` — HTTP.
- `beautifulsoup4` + `lxml` — parsing HTML.
- `supabase` — cliente oficial para escribir en Postgres.
- `python-dotenv` — carga `.env`.
- `yt-dlp` — extracción de vídeos para tools boosted.

## Configuración

Copiar `.env.example` → `.env` y rellenar:

```
SUPABASE_KEY=<service_role_key>   # o anon_key si solo escribe con políticas abiertas
```

`SUPABASE_URL` está hardcodeada en `config.py` al proyecto de producción — cambiar antes de correr contra otro entorno.

Parámetros relevantes en `config.py`:

| Clave | Default | Descripción |
|-------|---------|-------------|
| `REQUEST_TIMEOUT` | 10s | Timeout por request HTTP. |
| `REQUEST_DELAY` | 1.0s | Delay entre requests (rate-limit propio). |
| `REQUEST_DELAY_SLOW` | 2.0s | Delay tras recibir HTTP 429. |
| `MAX_RETRIES` | 3 | Reintentos por request. |
| `CHECKPOINT_INTERVAL` | 50 | Guarda progreso cada N items. |

## Scripts principales

| Archivo | Qué hace |
|---------|----------|
| `scraper.py` | Orquestador principal del scrape de tools. Lee sitemap, recorre URLs, llama a `parse_tool`, guarda via `db`. Usa checkpoint para reanudar. |
| `fetch_sitemap.py` | Descarga + parsea el sitemap XML de futurepedia. |
| `fetch_categories.py` | Lista de categorías desde la home de tools. |
| `fetch_api.py` | Wrapper sobre los endpoints API "ocultos" (JSON embebido en HTML). |
| `parse_tool.py` | Extrae título, descripción, logo, links, pricing, categorías de una página de tool. |
| `db.py` | Cliente Supabase + upserts idempotentes. |
| `enrich.py` / `enrich_scrape.py` | Segunda pasada: completa campos que el primer scrape dejó vacíos. |
| `experts.py` / `experts_scrape.py` | Scraper de perfiles de expertos. |
| `tutorials.py` / `tutorials_scrape.py` | Scraper de tutoriales. |

## Cómo ejecutar

```bash
cd ../scraper
python -m venv .venv
source .venv/Scripts/activate   # Git Bash en Windows
pip install -r requirements.txt
cp .env.example .env             # rellenar SUPABASE_KEY
python scraper.py                # scrape inicial de tools
python enrich.py                 # enriquecimiento posterior
python experts.py                # catálogo de expertos
python tutorials.py              # catálogo de tutoriales
```

## Artefactos de ejecución (gitignored)

- `*.log` — logs completos (pueden crecer a cientos de MB).
- `checkpoint.json`, `*_checkpoint.json` — estado para reanudar tras interrupciones.
- `__pycache__/`, `.env` — locales.

## Notas

- El scraper no es crítico para el runtime de la app; el catálogo puede quedarse estático sin él.
- Respetar el `REQUEST_DELAY` — futurepedia responde con 429 si se agresivo.
- Si se cambia de fuente de datos, reemplazar `BASE_URL` en `config.py` y reescribir `parse_tool.py`; el resto del pipeline es reutilizable.
