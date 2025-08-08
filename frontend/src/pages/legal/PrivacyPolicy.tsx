import LegalPage from '../../components/team/LegalPage';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Información que Recopilamos",
      content: [
        "En ProductTrack, recopilamos diferentes tipos de información para brindarle un mejor servicio:",
        <div key="info-types" className="space-y-4">
          <div className="bg-golden/10 p-4 rounded-lg border-l-4 border-golden">
            <h4 className="font-semibold text-burgundy mb-2">Información Personal</h4>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>Nombre completo y información de contacto</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Información de la empresa (si aplica)</li>
            </ul>
          </div>
          <div className="bg-olive/10 p-4 rounded-lg border-l-4 border-olive">
            <h4 className="font-semibold text-burgundy mb-2">Información de Uso</h4>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>Datos de productos ingresados en el sistema</li>
              <li>Patrones de uso de la aplicación</li>
              <li>Preferencias y configuraciones</li>
              <li>Logs de actividad y interacciones</li>
            </ul>
          </div>
        </div>
      ]
    },
    {
      title: "2. Cómo Utilizamos su Información",
      content: [
        "Utilizamos la información recopilada para los siguientes propósitos:",
        <ul key="usage-purposes" className="list-disc list-inside ml-4 space-y-2">
          <li><strong>Prestación del Servicio:</strong> Para proporcionar, mantener y mejorar ProductTrack</li>
          <li><strong>Personalización:</strong> Para personalizar su experiencia y ofrecer contenido relevante</li>
          <li><strong>Comunicación:</strong> Para enviarle actualizaciones, notificaciones y soporte técnico</li>
          <li><strong>Análisis:</strong> Para entender cómo se utiliza nuestra aplicación y mejorar nuestros servicios</li>
          <li><strong>Seguridad:</strong> Para detectar, prevenir y abordar actividades fraudulentas o de seguridad</li>
        </ul>
      ]
    },
    {
      title: "3. Compartir Información",
      content: [
        "ProductTrack no vende, alquila ni comparte su información personal con terceros, excepto en las siguientes circunstancias:",
        <div key="sharing-scenarios" className="space-y-3">
          <div className="bg-burgundy/10 p-3 rounded-lg">
            <strong className="text-burgundy">Con su Consentimiento:</strong> Cuando usted nos da permiso específico para hacerlo.
          </div>
          <div className="bg-burgundy/10 p-3 rounded-lg">
            <strong className="text-burgundy">Proveedores de Servicios:</strong> Con empresas que nos ayudan a operar nuestro servicio, bajo estrictos acuerdos de confidencialidad.
          </div>
          <div className="bg-burgundy/10 p-3 rounded-lg">
            <strong className="text-burgundy">Requerimientos Legales:</strong> Cuando sea requerido por ley o para proteger nuestros derechos legales.
          </div>
        </div>
      ]
    },
    {
      title: "4. Seguridad de los Datos",
      content: [
        "La seguridad de su información personal es una prioridad para nosotros. Implementamos múltiples capas de protección:",
        <div key="security-measures" className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-olive/10 p-4 rounded-lg">
            <h4 className="font-semibold text-burgundy mb-2">Encriptación</h4>
            <p className="text-sm text-gray-700">Todos los datos se transmiten usando encriptación SSL/TLS de grado militar.</p>
          </div>
          <div className="bg-golden/10 p-4 rounded-lg">
            <h4 className="font-semibold text-burgundy mb-2">Acceso Controlado</h4>
            <p className="text-sm text-gray-700">Solo personal autorizado tiene acceso a los sistemas que contienen información personal.</p>
          </div>
          <div className="bg-olive/10 p-4 rounded-lg">
            <h4 className="font-semibold text-burgundy mb-2">Monitoreo 24/7</h4>
            <p className="text-sm text-gray-700">Supervisamos continuamente nuestros sistemas para detectar vulnerabilidades y ataques.</p>
          </div>
          <div className="bg-golden/10 p-4 rounded-lg">
            <h4 className="font-semibold text-burgundy mb-2">Respaldos Seguros</h4>
            <p className="text-sm text-gray-700">Realizamos copias de seguridad regulares en ubicaciones geográficamente distribuidas.</p>
          </div>
        </div>
      ]
    },
    {
      title: "5. Sus Derechos y Opciones",
      content: [
        "Usted tiene varios derechos respecto a su información personal:",
        <div key="user-rights" className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
            <div>
              <strong className="text-burgundy">Acceso:</strong> Puede solicitar una copia de la información personal que tenemos sobre usted.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
            <div>
              <strong className="text-burgundy">Corrección:</strong> Puede solicitar que corrijamos información inexacta o incompleta.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
            <div>
              <strong className="text-burgundy">Eliminación:</strong> Puede solicitar que eliminemos su información personal en ciertas circunstancias.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-golden rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">4</div>
            <div>
              <strong className="text-burgundy">Portabilidad:</strong> Puede solicitar una copia de sus datos en un formato estructurado y legible por máquina.
            </div>
          </div>
        </div>
      ]
    },
    {
      title: "6. Cookies y Tecnologías Similares",
      content: [
        "ProductTrack utiliza cookies y tecnologías similares para mejorar su experiencia:",
        <div key="cookie-types" className="mt-4 space-y-4">
          <div className="border border-light-gray rounded-lg p-4">
            <h4 className="font-semibold text-burgundy mb-2">Cookies Esenciales</h4>
            <p className="text-gray-700 text-sm mb-2">Necesarias para el funcionamiento básico de la aplicación.</p>
            <div className="bg-olive/20 text-olive px-2 py-1 rounded text-xs inline-block">Siempre Activas</div>
          </div>
          <div className="border border-light-gray rounded-lg p-4">
            <h4 className="font-semibold text-burgundy mb-2">Cookies de Rendimiento</h4>
            <p className="text-gray-700 text-sm mb-2">Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio.</p>
            <div className="bg-golden/20 text-golden px-2 py-1 rounded text-xs inline-block">Opcional</div>
          </div>
        </div>
      ]
    },
    {
      title: "7. Retención de Datos",
      content: [
        "Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.",
        <div key="retention-periods" className="bg-light-gray/20 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-burgundy mb-3">Períodos de Retención Típicos:</h4>
          <ul className="space-y-2 text-sm">
            <li><strong>Datos de Cuenta:</strong> Mientras su cuenta esté activa + 2 años</li>
            <li><strong>Datos de Productos:</strong> Según sus configuraciones de retención</li>
            <li><strong>Logs de Sistema:</strong> 12 meses para propósitos de seguridad</li>
            <li><strong>Datos de Soporte:</strong> 3 años después del último contacto</li>
          </ul>
        </div>
      ]
    },
    {
      title: "8. Transferencias Internacionales",
      content: [
        "Sus datos pueden ser transferidos y procesados en países distintos al suyo. Cuando esto ocurra, nos aseguramos de que se mantengan las mismas protecciones de privacidad mediante:",
        <ul key="transfer-protections" className="list-disc list-inside ml-4 space-y-2 mt-4">
          <li>Cláusulas contractuales estándar aprobadas por las autoridades de protección de datos</li>
          <li>Certificaciones de adecuación de protección de datos</li>
          <li>Medidas de seguridad técnicas y organizativas apropiadas</li>
        </ul>
      ]
    },
    {
      title: "9. Menores de Edad",
      content: [
        "ProductTrack no está dirigido a menores de 16 años, y no recopilamos conscientemente información personal de menores de esta edad.",
        "Si descubrimos que hemos recopilado información personal de un menor de 16 años sin el consentimiento parental verificable, tomaremos medidas para eliminar esa información de nuestros servidores lo antes posible."
      ]
    },
    {
      title: "10. Contacto y Ejercicio de Derechos",
      content: [
        "Para ejercer sus derechos de privacidad o si tiene preguntas sobre esta política, puede contactarnos:",
        <div key="privacy-contact" className="bg-gradient-to-r from-olive/10 to-golden/10 p-6 rounded-xl mt-4 border border-olive/20">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-burgundy mb-2">Oficial de Protección de Datos</h4>
              <p className="text-sm text-gray-700 mb-1"><strong>Email:</strong> producttrack5@gmail.com</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Teléfono:</strong> +1 (555) 123-4568</p>
            </div>
            <div>
              <h4 className="font-semibold text-burgundy mb-2">Dirección Postal</h4>
              <p className="text-sm text-gray-700">
                ProductTrack Privacy Team<br />
                123 Tech Street<br />
                Innovation City, IC 12345
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Tiempo de Respuesta:</strong> Responderemos a su solicitud dentro de 30 días calendario. 
              Para solicitudes complejas, este período puede extenderse hasta 60 días con notificación previa.
            </p>
          </div>
        </div>
      ]
    }
  ];

  return (
    <LegalPage
      title="Política de Privacidad"
      lastUpdated="20 de junio del 2025"
      sections={sections}
    />
  );
};

export default PrivacyPolicy;