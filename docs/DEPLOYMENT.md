# Despliegue

## Frontend — Bolt.new

El repo `verilabo-admin/toolsnocode` está conectado a Bolt.new. Deploy automático al pushear a `main`. Bolt espera el `package.json` en la raíz del repo (no monorepo — ver notas más abajo).

**Build command**: `npm run build`
**Output directory**: `dist/`
**Install command**: `npm install`

Variables de entorno en Bolt (**no** se commitean):

| Variable | Dónde se usa |
|----------|--------------|
| `VITE_SUPABASE_URL` | Cliente (`src/lib/supabase.ts`). |
| `VITE_SUPABASE_ANON_KEY` | Cliente (`src/lib/supabase.ts`). |

## Backend — Supabase

### Migraciones SQL

Se aplican con `supabase db push` desde el CLI, o vía MCP durante ops puntuales. Ver [DATABASE.md](./DATABASE.md#aplicar-migraciones).

### Edge Functions

Desplegar todas:

```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy verify-tool-dns
supabase functions deploy fetch-and-rewrite-news
supabase functions deploy enrich-news
supabase functions deploy sitemap
```

Secrets por función (se configuran con `supabase secrets set KEY=value`):

| Función | Secrets requeridos |
|---------|-------------------|
| `stripe-checkout` | `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `stripe-webhook` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `verify-tool-dns` | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `fetch-and-rewrite-news` | `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `enrich-news` | `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `sitemap` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (solo lectura) |

**CORS**: todas las funciones aceptan solo `https://toolsnocode.com`, `http://localhost:5173`, `http://localhost:4173`. Ajustar `ALLOWED_ORIGINS` en cada `index.ts` si cambia el dominio.

### Stripe

- **Webhook endpoint**: `https://<project>.supabase.co/functions/v1/stripe-webhook`.
- **Eventos suscritos**: `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.paid|payment_failed`.
- Obtener `STRIPE_WEBHOOK_SECRET` al crear el endpoint en Stripe Dashboard.

### Cron jobs

Definidos en migraciones (`pg_cron`). No requieren deploy separado — se crean al aplicar las migraciones correspondientes.

## Configuración manual post-deploy

Estos toggles no están automatizados y hay que activarlos en el dashboard de Supabase:

- **Leaked Password Protection**: `Authentication → Providers → Email → Check passwords against HaveIBeenPwned`. Recomendado.
- **Email templates**: `Authentication → Email Templates`. Personalizar sender + plantillas de confirmación.
- **Auth providers**: si se añade Google/GitHub, configurar credenciales OAuth.

## Notas operativas

- **Divergencia repo ↔ DB**: las migraciones aplicadas vía MCP también quedan en `supabase_migrations.schema_migrations`. Si falta el archivo en el repo, añadirlo después es seguro (Supabase detecta la versión ya aplicada).
- **Rollback de migración**: escribir una migración nueva que revierta el cambio. No se recomienda borrar archivos ya aplicados.
- **Monorepo**: se exploró mover el repo a `apps/web + services/scraper` pero Bolt falló al detectar `package.json`. Si se retoma, hay que configurar `rootDirectory` en Bolt o separar los dos en repos distintos. Detalles en el commit history de abril 2026.
