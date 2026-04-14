# Base de datos

Postgres gestionado por Supabase. Todas las tablas de `public.` tienen RLS activado. Las migraciones viven en `supabase/migrations/` y se ejecutan en orden alfabético por timestamp.

## Tablas (schema `public`)

| Tabla | Filas aprox. | Descripción |
|-------|-------------:|-------------|
| `categories` | 33 | Categorías de tools (árbol plano por ahora). |
| `tools` | 2 779 | Herramientas no-code. Entidad principal. |
| `experts` | 4 306 | Profesionales / consultores. |
| `expert_tools` | 6 733 | Unión many-to-many experts ↔ tools. |
| `tutorials` | 7 680 | Tutoriales enlazados a tools/categorías. |
| `projects` | 27 | Casos de uso / showcases. |
| `project_tools` | 57 | Unión many-to-many projects ↔ tools. |
| `favorites` | 5 | Favoritos por `user_id`. |
| `votes` | 9 | Upvotes sobre entidades (tool/expert/tutorial/project). |
| `claims` | 2 | Reclamaciones de propiedad resueltas. |
| `claim_requests` | 1 | Peticiones pendientes (fallback manual). |
| `tool_verifications` | 0 | Tokens DNS TXT activos para verificación. |
| `news` | 20 | Noticias reescritas por el pipeline. |
| `stripe_customers` | 1 | Map `user_id` ↔ `stripe_customer_id`. |
| `stripe_subscriptions` | 2 | Estado de suscripción por usuario. |
| `stripe_orders` | 0 | Pagos one-off. |

## Convenciones de migraciones

- Formato de nombre: `YYYYMMDDHHMMSS_<snake_case>.sql`.
- Cabecera con bloque `/* ... */` que documenta qué hace y por qué.
- Crean o alteran objetos de forma idempotente (`IF NOT EXISTS`, `CREATE OR REPLACE`, `DROP POLICY IF EXISTS`).
- Las seeds iniciales viven en migraciones con prefijo `seed_` (`seed_tools_data.sql`, etc.).

## RLS — patrones comunes

- **Lectura pública**: la mayoría de catálogos (`tools`, `experts`, `tutorials`, `projects`, `news`, `categories`) tienen `SELECT` abierto a `anon` y `authenticated`.
- **Escritura por propietario**: `INSERT`/`UPDATE`/`DELETE` se restringen con `USING (auth.uid() = user_id)` o equivalente (p. ej. `owner_id` en `tools`).
- **Tablas Stripe**: `SELECT` limitado a filas cuyo `user_id = auth.uid()`; escrituras solo desde service role (edge functions).
- **Favorites / votes**: política per-user clásica.

## Triggers destacados

### `enforce_tool_video_url_boost`

Archivo: `20260409165012_enforce_video_url_requires_boost.sql`, actualizado por `20260414120000_fix_security_advisor_warnings.sql`.

Fuerza `video_url = ''` al insertar/actualizar una tool si `is_boosted = false`. Evita que usuarios pongan un vídeo destacado sin pagar la suscripción. Pinneado con `SET search_path = public, pg_temp` para evitar hijacking.

### Slug autogenerado en `news`

Migración: `20260322110514_add_slug_to_news.sql`. Genera slug desde el título usando `regexp_replace` + deduplicación con sufijo incremental.

## Extensiones habilitadas

- `pg_cron` — cron jobs a nivel de base de datos (pipeline de noticias).
- `pg_net` — HTTP requests desde SQL (el cron invoca edge functions vía `net.http_post`).

Habilitadas en `20260322111757_enable_cron_and_net_extensions.sql`.

## Storage — bucket `uploads`

- **Público**: `public = true`, objetos servidos por CDN.
- **Límite**: 5 MB por archivo.
- **MIME permitidos**: `image/webp`, `image/jpeg`, `image/png`, `image/gif`, `image/avif`.
- **Estructura**: `uploads/{type}/{userId}/{filename}`. Ejemplo: `uploads/logos/abc-123/tool-name.webp`.

**Policies activas** (sobre `storage.objects`):
- `Authenticated users can upload` — INSERT si el `userId` del path coincide con `auth.uid()`.
- `Users can update own uploads` — UPDATE sobre propias.
- `Users can delete own uploads` — DELETE sobre propias.
- ~~`Public read access on uploads`~~ — **eliminada** en `20260414120000_fix_security_advisor_warnings.sql`. El listing público del bucket era innecesario porque las URLs se resuelven por CDN sin pasar por `storage.objects` SELECT.

## Aplicar migraciones

```bash
# via Supabase CLI (recomendado)
supabase db push

# o vía MCP / dashboard si el cambio es urgente
```

Las migraciones se registran en `supabase_migrations.schema_migrations`. Si el archivo y la tabla divergen (p. ej. un fix aplicado solo vía MCP), se resuelve añadiendo el archivo al repo y re-pusheando — Supabase detecta la versión ya aplicada y la salta.
