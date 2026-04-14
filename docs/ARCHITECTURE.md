# Arquitectura

## Vista general

Toolsnocode es una SPA (Vite + React Router) que habla directamente con Supabase desde el cliente para la mayoría de operaciones (lecturas + escrituras sobre tablas con RLS). Las operaciones privilegiadas o con secretos (pagos, DNS, pipeline de noticias, sitemap) viven en Edge Functions de Supabase (Deno runtime).

```
┌──────────────┐       ┌─────────────────────────┐       ┌──────────────┐
│   Browser    │─HTTPS─▶   Supabase (Postgres)   │◀──────│   Scraper    │
│  React SPA   │       │   RLS + Auth + Storage  │       │   (Python)   │
└──────┬───────┘       └──────────┬──────────────┘       └──────────────┘
       │                          │
       │ invoke edge fns          │ writes via service role
       ▼                          │
┌──────────────┐                  │
│  Edge Funcs  │──────────────────┘
│   (Deno)     │
└──────┬───────┘
       │
       ├─▶ Stripe API (checkout/webhooks)
       ├─▶ OpenAI API (rewrite de noticias)
       └─▶ DNS / feeds RSS externos
```

## Rutas del frontend

Definidas en `src/App.tsx`. Todas las rutas autenticadas usan `ProtectedRoute`.

| Ruta | Página | Auth |
|------|--------|------|
| `/` | HomePage | pública |
| `/tools`, `/tools/:slug` | ToolsPage, ToolDetailPage | pública |
| `/tools/new`, `/tools/:slug/edit` | ToolFormPage | pública (creación libre; edición requiere owner) |
| `/experts`, `/tutorials`, `/projects`, `/news` | listados + detalle | públicas |
| `/account` | AccountPage | **requiere login** |
| `/favorites` | FavoritesPage | **requiere login** |
| `/pricing` | PricingPage | pública |
| `/success` | SuccessPage | **requiere login** (post-Stripe checkout) |
| `/login`, `/signup`, `/auth` | flujos de auth | pública |
| `/legal/{privacy,terms,cookies}` | legal | pública |

## Autenticación

- **Provider**: Supabase Auth (email + password, Google OAuth via `GoogleButton`).
- **Estado**: `AuthContext` (`src/contexts/AuthContext.tsx`) expone `user`, `session` y se suscribe a `onAuthStateChange`.
- **Hook consumidor**: `useAuth()` en `src/hooks/useAuth.ts`.
- **Guardián de rutas**: `src/components/auth/ProtectedRoute.tsx` redirige a `/login` si no hay sesión.
- **Leaked password protection**: se habilita en el dashboard de Supabase (Auth → Providers → Email → "Check against HaveIBeenPwned").

## Integración Stripe

Dos Edge Functions y tres tablas (`stripe_customers`, `stripe_subscriptions`, `stripe_orders`).

**Flujo de checkout** (`supabase/functions/stripe-checkout/index.ts`):
1. Cliente autenticado llama a la función con un `price_id` y `mode` (subscription / payment).
2. Función crea o reutiliza un customer de Stripe vinculado al `user_id` en `stripe_customers`.
3. Crea una Checkout Session y devuelve la URL al frontend, que redirige al usuario.
4. Tras el pago Stripe redirige a `/success`.

**Flujo de webhook** (`supabase/functions/stripe-webhook/index.ts`):
- Verifica la firma con `STRIPE_WEBHOOK_SECRET`.
- Maneja `checkout.session.completed`, `customer.subscription.*` y `invoice.*`.
- Persiste subscripciones activas en `stripe_subscriptions` y pedidos one-off en `stripe_orders`.
- El frontend lee estado de suscripción desde `stripe_subscriptions` (con RLS por `user_id`).

Los ítems "boosted" en `tools` (`is_boosted = true`) son los que tienen suscripción Stripe activa. Un trigger fuerza que `video_url` solo se guarde si `is_boosted` es verdadero (ver [DATABASE.md](./DATABASE.md)).

## Pipeline de noticias

Dos Edge Functions disparadas por `pg_cron`:

1. **`fetch-and-rewrite-news`** (`supabase/functions/fetch-and-rewrite-news/index.ts`)
   - Recorre ~6 feeds RSS (TechCrunch, Verge, Ars Technica, VentureBeat, O'Reilly, Wired).
   - Para cada nuevo ítem: llama a OpenAI para reescribir título + cuerpo, genera slug, guarda en `news`.
2. **`enrich-news`** — pasadas adicionales de enriquecimiento sobre filas ya creadas.

**Cron jobs**: definidos en migraciones `20260322111813_create_daily_news_cron_job.sql` y `20260322111823_update_daily_news_cron_use_pgnet.sql`. Usan la extensión `pg_net` para invocar la edge function vía HTTPS.

## Verificación de tools (claim ownership)

Un usuario puede reclamar ser dueño de una tool demostrando control sobre su dominio:

1. `ToolDetailPage` → botón `VerifyToolButton` llama a la edge function `verify-tool-dns`.
2. La función (`supabase/functions/verify-tool-dns/index.ts`) genera un token, lo guarda en `tool_verifications` y pide al usuario añadir un registro TXT DNS.
3. Al re-invocar la función, resuelve el DNS del dominio y si encuentra el token, marca la tool como verificada y transfiere `owner_id`.
4. Existe además un flujo de `claim_requests` manual como fallback (usuario rellena formulario, admin revisa).

## Sitemap

`supabase/functions/sitemap/index.ts` genera un sitemap XML dinámico con todas las tools, experts, tutorials, projects y news publicadas. Cacheable por CDN.

## Storage

Único bucket: `uploads` (público, CDN). Estructura: `uploads/{type}/{userId}/{filename}.webp`. Subida desde `ImageUploader` (`src/components/ui/ImageUploader.tsx`), que espera imágenes ya convertidas a WebP por el cliente. Tamaño máx: 5 MB. Ver [DATABASE.md](./DATABASE.md) para las políticas de storage.

## SEO

`useSEO` (`src/hooks/useSEO.ts`) envuelve `react-helmet-async` para inyectar `<title>`, meta description, canonical y OpenGraph por página. La home incorpora JSON-LD de estructura.
