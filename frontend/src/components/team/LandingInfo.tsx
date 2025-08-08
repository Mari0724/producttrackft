import { Shield, Package, History, Bell, Smartphone, ScanSearch } from 'lucide-react';

const LandingInfo = () => {
  return (
    <>
      {/* Hero o texto de bienvenida */}
      <section className="bg-olive text-white py-8 text-center">
        <h1 className="text-4xl font-bold mb-2">¿Qué hacemos?</h1>
        <p className="text-white/90 text-lg">
          Te ayudamos a llevar el control de tus productos, ya seas una empresa o una persona del común. ¡Escanea, organiza y recibe alertas fácilmente!
        </p>
      </section>

      {/* Características */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-burgundy text-center mb-10">Características principales</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <ScanSearch className="w-10 h-10" />, title: 'NutriScan', description: 'Escanea productos con tu cámara y consulta su información nutricional (ideal para personas).' },
            { icon: <Package className="w-10 h-10" />, title: 'Gestión de Inventario', description: 'Control en tiempo real de tus productos personales o empresariales.' },
            { icon: <History className="w-10 h-10" />, title: 'Historial de Productos', description: ' Consulta fácilmente los cambios y movimientos recientes en tus productos.' },
            { icon: <Bell className="w-10 h-10" />, title: 'Alertas Inteligentes', description: 'Notificaciones personalizadas para no perder de vista nada.' },
            { icon: <Smartphone className="w-10 h-10" />, title: 'Multiplataforma', description: 'Accede desde cualquier lugar con cualquier dispositivo.' },
            { icon: <Shield className="w-10 h-10" />, title: 'Seguridad Total', description: 'Tus datos están siempre protegidos.' }
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border">
              <div className="text-olive mb-2">{f.icon}</div>
              <h3 className="text-xl font-semibold text-burgundy">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default LandingInfo;