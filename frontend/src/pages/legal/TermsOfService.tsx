import LegalPage from '../../components/team/LegalPage';

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Aceptación de los Términos",
      content: [
        "Al acceder y utilizar ProductTrack, usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.",
        "Estos términos constituyen un acuerdo legal vinculante entre usted y ProductTrack. Nos reservamos el derecho de modificar estos términos en cualquier momento, y dichas modificaciones entrarán en vigor inmediatamente después de su publicación en la aplicación."
      ]
    },
    {
      title: "2. Descripción del Servicio",
      content: [
        "ProductTrack es una aplicación diseñada para ayudar a los usuarios a rastrear y gestionar productos de manera eficiente. Nuestros servicios incluyen, pero no se limitan a:",
        <ul key="services" className="list-disc list-inside ml-4 space-y-2">
          <li>Seguimiento de inventario en tiempo real</li>
          <li>Gestión de productos y categorías</li>
          <li>Generación de reportes y análisis</li>
          <li>Sincronización de datos en múltiples dispositivos</li>
          <li>Notificaciones y alertas personalizadas</li>
        </ul>
      ]
    },
    {
      title: "3. Registro y Cuenta de Usuario",
      content: [
        "Para utilizar ciertas funciones de ProductTrack, debe crear una cuenta proporcionando información precisa y completa. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.",
        "Se compromete a notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta o cualquier otra violación de seguridad. No seremos responsables de ninguna pérdida que pueda incurrir como resultado del uso no autorizado de su cuenta."
      ]
    },
    {
      title: "4. Uso Aceptable",
      content: [
        "Al utilizar ProductTrack, se compromete a:",
        <ul key="acceptable-use" className="list-disc list-inside ml-4 space-y-2">
          <li>Utilizar el servicio únicamente para fines legales y apropiados</li>
          <li>No interferir con el funcionamiento normal de la aplicación</li>
          <li>No intentar acceder a áreas restringidas del sistema</li>
          <li>No utilizar el servicio para actividades fraudulentas o maliciosas</li>
          <li>Respetar los derechos de propiedad intelectual</li>
        </ul>
      ]
    },
    {
      title: "5. Privacidad y Protección de Datos",
      content: [
        "Su privacidad es importante para nosotros. La recopilación y uso de su información personal se rige por nuestra Política de Privacidad, que forma parte integral de estos términos.",
        "Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra el acceso no autorizado, alteración, divulgación o destrucción."
      ]
    },
    {
      title: "6. Propiedad Intelectual",
      content: [
        "Todo el contenido, características y funcionalidades de ProductTrack, incluyendo pero no limitándose a texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y software, son propiedad exclusiva de ProductTrack y están protegidos por leyes de derechos de autor, marcas registradas y otras leyes de propiedad intelectual.",
        "Se le otorga una licencia limitada, no exclusiva y no transferible para usar ProductTrack únicamente para sus fines comerciales legítimos de acuerdo con estos términos."
      ]
    },
    {
      title: "7. Limitación de Responsabilidad",
      content: [
        "ProductTrack se proporciona 'tal como está' sin garantías de ningún tipo. No garantizamos que el servicio será ininterrumpido, libre de errores o completamente seguro.",
        "En ningún caso ProductTrack será responsable por daños indirectos, incidentales, especiales, consecuenciales o punitivos, incluyendo pero no limitándose a pérdida de beneficios, datos o uso, independientemente de si hemos sido advertidos de la posibilidad de tales daños."
      ]
    },
    {
      title: "8. Terminación",
      content: [
        "Podemos terminar o suspender su cuenta y acceso al servicio inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo sin limitación si usted incumple los Términos y Condiciones.",
        "Tras la terminación, su derecho a usar el servicio cesará inmediatamente. Si desea terminar su cuenta, puede simplemente dejar de usar el servicio."
      ]
    },
    {
      title: "9. Modificaciones del Servicio",
      content: [
        "Nos reservamos el derecho de modificar o discontinuar el servicio (o cualquier parte del mismo) temporalmente o permanentemente, con o sin aviso previo.",
        "No seremos responsables ante usted o cualquier tercero por cualquier modificación, suspensión o discontinuación del servicio."
      ]
    },
    {
      title: "10. Contacto",
      content: [
        "Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de:",
        <div key="contact" className="bg-light-gray/30 p-4 rounded-lg mt-4">
          <p><strong>Email:</strong> producttrack5@gmail.com</p>
          <p><strong>Teléfono:</strong> +1 (555) 123-4567</p>
          <p><strong>Dirección:</strong> 123 Tech Street, Innovation City, IC 12345</p>
        </div>
      ]
    }
  ];

  return (
    <LegalPage
      title="Términos y Condiciones"
      lastUpdated="20 de junio del 2025"
      sections={sections}
    />
  );
};

export default TermsOfService;