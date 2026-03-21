import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const LAST_UPDATED = '21 de marzo de 2025';
const SITE_NAME = 'ToolsNoCode';
const CONTACT_EMAIL = 'privacy@toolsnocode.com';
const SITE_URL = 'toolsnocode.com';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Política de Privacidad</h1>
        </div>
        <p className="text-sm text-surface-500 mb-10">Última actualización: {LAST_UPDATED}</p>

        <div className="prose-legal">

          <Section title="1. Responsable del tratamiento">
            <p>
              El responsable del tratamiento de sus datos personales es <strong>{SITE_NAME}</strong>, accesible en{' '}
              <strong>{SITE_URL}</strong>. Para cualquier consulta relacionada con privacidad puede contactarnos en{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-400 hover:text-brand-300">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. Datos que recopilamos">
            <p>Recopilamos los siguientes tipos de datos personales:</p>
            <ul>
              <li><strong>Datos de registro:</strong> dirección de correo electrónico y contraseña (almacenada de forma cifrada) cuando crea una cuenta.</li>
              <li><strong>Datos de uso:</strong> información sobre cómo interactúa con la plataforma, como las herramientas que visita, los favoritos que guarda y el contenido que publica.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, páginas visitadas y tiempo de sesión, recopilados de forma automática mediante cookies y tecnologías similares.</li>
            </ul>
            <p>No recopilamos datos especialmente sensibles (salud, origen racial, creencias religiosas, etc.).</p>
          </Section>

          <Section title="3. Finalidad y base legal del tratamiento">
            <table>
              <thead>
                <tr>
                  <th>Finalidad</th>
                  <th>Base legal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gestión de su cuenta y acceso a la plataforma</td>
                  <td>Ejecución de contrato (Art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td>Guardar favoritos y contenido creado por el usuario</td>
                  <td>Ejecución de contrato (Art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td>Mejora del servicio y análisis estadístico anónimo</td>
                  <td>Interés legítimo (Art. 6.1.f RGPD)</td>
                </tr>
                <tr>
                  <td>Comunicaciones de servicio (cambios, incidencias)</td>
                  <td>Ejecución de contrato (Art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td>Cumplimiento de obligaciones legales</td>
                  <td>Obligación legal (Art. 6.1.c RGPD)</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="4. Conservación de los datos">
            <p>
              Conservamos sus datos mientras su cuenta esté activa o sea necesario para prestarle el servicio. Si elimina su cuenta, borraremos sus datos personales en un plazo máximo de <strong>30 días</strong>, salvo que exista obligación legal de conservarlos durante un período superior.
            </p>
          </Section>

          <Section title="5. Destinatarios y transferencias internacionales">
            <p>Sus datos pueden ser compartidos con los siguientes proveedores de servicios que actúan como encargados del tratamiento:</p>
            <ul>
              <li><strong>Supabase Inc.</strong> — infraestructura de base de datos y autenticación (EE. UU., con salvaguardas adecuadas mediante Cláusulas Contractuales Tipo).</li>
              <li><strong>Vercel Inc.</strong> / proveedor de hosting — alojamiento y distribución de la aplicación web.</li>
            </ul>
            <p>No vendemos ni cedemos sus datos a terceros con fines comerciales.</p>
          </Section>

          <Section title="6. Sus derechos">
            <p>En virtud del RGPD y la LOPDGDD, usted tiene derecho a:</p>
            <ul>
              <li><strong>Acceso:</strong> obtener confirmación de si tratamos sus datos y acceder a ellos.</li>
              <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar el borrado de sus datos ("derecho al olvido").</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
              <li><strong>Limitación:</strong> solicitar la restricción del tratamiento en determinadas circunstancias.</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y de uso común.</li>
              <li><strong>Retirar el consentimiento</strong> en cualquier momento cuando el tratamiento se base en él.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, envíe un correo a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-400 hover:text-brand-300">{CONTACT_EMAIL}</a>.
              Tiene también derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">www.aepd.es</a>.
            </p>
          </Section>

          <Section title="7. Seguridad">
            <p>
              Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos frente a accesos no autorizados, pérdida o destrucción, incluyendo cifrado en tránsito (TLS) y en reposo, control de accesos y auditorías periódicas de seguridad.
            </p>
          </Section>

          <Section title="8. Menores de edad">
            <p>
              Este servicio no está dirigido a menores de 16 años. Si tiene conocimiento de que un menor nos ha proporcionado datos personales, póngase en contacto con nosotros para proceder a su eliminación.
            </p>
          </Section>

          <Section title="9. Cambios en esta política">
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos los cambios significativos mediante un aviso en la plataforma o por correo electrónico. La versión actualizada entrará en vigor en la fecha de publicación indicada al inicio de este documento.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-wrap gap-4 text-sm text-surface-500">
          <Link to="/legal/terms" className="hover:text-brand-400 transition-colors">Términos de Servicio</Link>
          <Link to="/legal/cookies" className="hover:text-brand-400 transition-colors">Política de Cookies</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-surface-800/60">{title}</h2>
      <div className="space-y-3 text-surface-300 text-sm leading-relaxed [&_strong]:text-surface-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-400 [&_a:hover]:text-brand-300 [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-surface-400 [&_th]:uppercase [&_th]:tracking-wider [&_th]:pb-2 [&_td]:py-2 [&_td]:pr-4 [&_td]:border-t [&_td]:border-surface-800/50 [&_td]:text-sm">
        {children}
      </div>
    </section>
  );
}
