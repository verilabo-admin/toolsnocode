import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const LAST_UPDATED = '21 de marzo de 2025';
const SITE_NAME = 'ToolsNoCode';
const CONTACT_EMAIL = 'legal@toolsnocode.com';
const SITE_URL = 'toolsnocode.com';

export default function TermsOfServicePage() {
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
            <FileText className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Términos de Servicio</h1>
        </div>
        <p className="text-sm text-surface-500 mb-10">Última actualización: {LAST_UPDATED}</p>

        <div>

          <Section title="1. Aceptación de los términos">
            <p>
              Al acceder o utilizar <strong>{SITE_NAME}</strong> ({SITE_URL}), usted acepta quedar vinculado por estos Términos de Servicio y por nuestra{' '}
              <Link to="/legal/privacy" className="text-brand-400 hover:text-brand-300">Política de Privacidad</Link>.
              Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar el servicio.
            </p>
          </Section>

          <Section title="2. Descripción del servicio">
            <p>
              {SITE_NAME} es una plataforma de descubrimiento que permite a los usuarios encontrar, explorar y compartir herramientas de inteligencia artificial y no-code, tutoriales, proyectos y expertos del sector. El servicio se ofrece de forma gratuita con funcionalidades adicionales para usuarios registrados.
            </p>
          </Section>

          <Section title="3. Registro y cuenta de usuario">
            <p>Para acceder a determinadas funciones (guardar favoritos, publicar contenido) es necesario crear una cuenta. Al hacerlo, usted se compromete a:</p>
            <ul>
              <li>Proporcionar información veraz, precisa y actualizada.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Notificarnos inmediatamente ante cualquier uso no autorizado de su cuenta.</li>
              <li>Ser responsable de todas las actividades realizadas bajo su cuenta.</li>
            </ul>
            <p>Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos.</p>
          </Section>

          <Section title="4. Contenido generado por el usuario">
            <p>
              Al publicar herramientas, proyectos, tutoriales o cualquier otro contenido en {SITE_NAME}, usted declara que:
            </p>
            <ul>
              <li>Es el propietario del contenido o dispone de los derechos necesarios para publicarlo.</li>
              <li>El contenido no infringe derechos de terceros (propiedad intelectual, privacidad, etc.).</li>
              <li>El contenido no es ilegal, ofensivo, engañoso ni spam.</li>
            </ul>
            <p>
              Nos concede una licencia mundial, no exclusiva, libre de regalías para mostrar y distribuir dicho contenido dentro de la plataforma. Usted conserva la titularidad del mismo.
            </p>
          </Section>

          <Section title="5. Conducta del usuario">
            <p>Queda expresamente prohibido:</p>
            <ul>
              <li>Utilizar el servicio para actividades ilegales o fraudulentas.</li>
              <li>Publicar contenido falso, engañoso o spam.</li>
              <li>Intentar acceder de forma no autorizada a sistemas o datos de otros usuarios.</li>
              <li>Usar scrapers, bots u otros medios automatizados para extraer datos de la plataforma sin autorización expresa.</li>
              <li>Suplantar la identidad de otras personas o entidades.</li>
              <li>Interferir con el correcto funcionamiento de la plataforma.</li>
            </ul>
          </Section>

          <Section title="6. Propiedad intelectual">
            <p>
              La marca, el diseño, el código y los contenidos propios de {SITE_NAME} son propiedad de sus creadores y están protegidos por las leyes de propiedad intelectual. Queda prohibida su reproducción, distribución o modificación sin autorización previa y por escrito.
            </p>
            <p>
              Los nombres de herramientas de terceros, logotipos y marcas comerciales mencionados en la plataforma son propiedad de sus respectivos titulares y se utilizan únicamente con fines informativos.
            </p>
          </Section>

          <Section title="7. Exención de responsabilidad">
            <p>
              {SITE_NAME} actúa como directorio de herramientas y recursos de terceros. No garantizamos la exactitud, disponibilidad, seguridad o idoneidad de las herramientas listadas, ni nos hacemos responsables de los daños derivados de su uso.
            </p>
            <p>
              El servicio se proporciona "tal cual" (<em>as is</em>) sin garantías de ningún tipo, expresas o implícitas, incluyendo disponibilidad ininterrumpida o ausencia de errores.
            </p>
          </Section>

          <Section title="8. Limitación de responsabilidad">
            <p>
              En la máxima medida permitida por la ley aplicable, {SITE_NAME} y sus colaboradores no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso o la imposibilidad de uso del servicio.
            </p>
          </Section>

          <Section title="9. Modificaciones del servicio">
            <p>
              Nos reservamos el derecho de modificar, suspender o interrumpir el servicio (o cualquier parte del mismo) en cualquier momento, con o sin previo aviso. No seremos responsables ante usted ni ante terceros por dichas modificaciones o interrupciones.
            </p>
          </Section>

          <Section title="10. Modificaciones de los términos">
            <p>
              Podemos actualizar estos Términos de Servicio en cualquier momento. La fecha de la última actualización se indica al inicio del documento. El uso continuado del servicio tras la publicación de cambios implica la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section title="11. Ley aplicable y jurisdicción">
            <p>
              Estos términos se rigen por la legislación española. Para la resolución de cualquier controversia, las partes se someten a los juzgados y tribunales competentes de España, salvo que la normativa de consumo aplicable establezca otro fuero.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para cualquier consulta sobre estos Términos de Servicio, puede contactarnos en{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-400 hover:text-brand-300">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-wrap gap-4 text-sm text-surface-500">
          <Link to="/legal/privacy" className="hover:text-brand-400 transition-colors">Política de Privacidad</Link>
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
      <div className="space-y-3 text-surface-300 text-sm leading-relaxed [&_strong]:text-surface-200 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-brand-400 [&_a:hover]:text-brand-300 [&_em]:text-surface-300">
        {children}
      </div>
    </section>
  );
}
