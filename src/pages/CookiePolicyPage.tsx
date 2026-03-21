import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';

const LAST_UPDATED = '21 de marzo de 2025';
const SITE_NAME = 'ToolsNoCode';
const CONTACT_EMAIL = 'privacy@toolsnocode.com';

type CookieRow = { name: string; type: string; purpose: string; duration: string };

const cookieTable: CookieRow[] = [
  {
    name: 'sb-*-auth-token',
    type: 'Necesaria',
    purpose: 'Gestión de la sesión de usuario autenticado (Supabase Auth)',
    duration: 'Sesión / 1 semana',
  },
  {
    name: 'sb-*-refresh-token',
    type: 'Necesaria',
    purpose: 'Renovación automática del token de acceso',
    duration: '1 semana',
  },
  {
    name: '__cf_bm',
    type: 'Necesaria',
    purpose: 'Protección contra bots (Cloudflare)',
    duration: '30 minutos',
  },
  {
    name: '_vercel_no_cache',
    type: 'Necesaria',
    purpose: 'Control de caché del servidor (Vercel)',
    duration: 'Sesión',
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center border border-brand-500/20">
            <Cookie className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Política de Cookies</h1>
        </div>
        <p className="text-sm text-surface-500 mb-10">Última actualización: {LAST_UPDATED}</p>

        <div className="space-y-0">

          <Section title="1. ¿Qué son las cookies?">
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo cuando los visita. Permiten que el sitio recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga que volver a introducirlas cada vez que regrese.
            </p>
          </Section>

          <Section title="2. Cookies que utilizamos">
            <p>
              {SITE_NAME} utiliza exclusivamente cookies <strong>técnicas y necesarias</strong> para el correcto funcionamiento del servicio. No utilizamos cookies de publicidad ni de seguimiento de terceros con fines comerciales.
            </p>

            <div className="overflow-x-auto mt-4 rounded-xl border border-surface-800/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800/60 bg-surface-900/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Nombre</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Finalidad</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider whitespace-nowrap">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTable.map((row, i) => (
                    <tr key={i} className="border-b border-surface-800/40 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-brand-300 whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-3 text-surface-300">
                        <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs px-2 py-0.5 rounded-full">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-400 text-xs leading-relaxed">{row.purpose}</td>
                      <td className="px-4 py-3 text-surface-400 text-xs whitespace-nowrap">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="3. Cookies de terceros">
            <p>
              Algunos tutoriales pueden incluir videos embebidos de plataformas externas como YouTube. Al reproducir un video, estas plataformas pueden instalar sus propias cookies en su dispositivo, sujetas a sus respectivas políticas de privacidad:
            </p>
            <ul>
              <li>
                <strong>YouTube (Google LLC):</strong> utilizamos la versión privada de YouTube (<code className="text-brand-300 bg-surface-900 px-1.5 py-0.5 rounded text-xs">youtube-nocookie.com</code>) para minimizar el uso de cookies. Las cookies solo se instalan al hacer clic en el video.{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de privacidad de Google</a>.
              </li>
            </ul>
            <p>
              Si prefiere evitar estas cookies, puede optar por abrir los videos directamente en YouTube usando el enlace "Open on YouTube" disponible en cada tutorial.
            </p>
          </Section>

          <Section title="4. Cómo gestionar las cookies">
            <p>
              Puede configurar su navegador para bloquear o eliminar cookies. Tenga en cuenta que si bloquea las cookies necesarias, algunas funciones del sitio (como el inicio de sesión) dejarán de funcionar correctamente.
            </p>
            <p>Instrucciones para los principales navegadores:</p>
            <ul>
              <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
              <li><strong>Mozilla Firefox:</strong> Ajustes &gt; Privacidad y seguridad &gt; Cookies y datos del sitio.</li>
              <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Gestionar datos de sitios web.</li>
              <li><strong>Microsoft Edge:</strong> Configuración &gt; Cookies y permisos de sitios &gt; Cookies y datos guardados.</li>
            </ul>
          </Section>

          <Section title="5. Consentimiento">
            <p>
              Las cookies técnicas y necesarias no requieren su consentimiento según el artículo 22.2 de la LSSI-CE, ya que son imprescindibles para la prestación del servicio. No utilizamos cookies que requieran consentimiento previo (publicidad, seguimiento de comportamiento).
            </p>
            <p>
              En el caso de cookies de terceros incrustadas (ej. YouTube), estas solo se activan a petición expresa del usuario al hacer clic en el reproductor.
            </p>
          </Section>

          <Section title="6. Actualizaciones de esta política">
            <p>
              Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies utilizadas. Le recomendamos revisar esta página periódicamente. La fecha de la última actualización se indica al inicio del documento.
            </p>
          </Section>

          <Section title="7. Contacto">
            <p>
              Para cualquier duda sobre nuestra Política de Cookies, puede contactarnos en{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-400 hover:text-brand-300">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-wrap gap-4 text-sm text-surface-500">
          <Link to="/legal/privacy" className="hover:text-brand-400 transition-colors">Política de Privacidad</Link>
          <Link to="/legal/terms" className="hover:text-brand-400 transition-colors">Términos de Servicio</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-surface-800/60">{title}</h2>
      <div className="space-y-3 text-surface-300 text-sm leading-relaxed [&_strong]:text-surface-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-400 [&_a:hover]:text-brand-300 [&_code]:text-brand-300 [&_code]:bg-surface-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs">
        {children}
      </div>
    </section>
  );
}
