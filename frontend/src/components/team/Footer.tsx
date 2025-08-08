import { Link } from "react-router-dom";
import { FileText, Shield } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t border-light-gray/30">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Logo y descripción */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-burgundy mb-4">
            Product<span className="text-golden">Track</span>
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            La plataforma líder en gestión y seguimiento de productos, diseñada para impulsar el crecimiento de tu negocio.
          </p>
          <p className="text-gray-600 mb-6">✉️ producttrack5@gmail.com</p>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center text-white font-bold">P</div>
            <div className="w-10 h-10 bg-golden rounded-full flex items-center justify-center text-burgundy font-bold">T</div>
          </div>
        </div>

        {/* Sección Legal */}
        <div>
          <h4 className="font-semibold text-burgundy mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/terminos-y-condiciones" className="hover:text-olive transition-colors flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link to="/politica-de-privacidad" className="hover:text-olive transition-colors flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="border-t border-light-gray/30 mt-12 pt-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 ProductTrack. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;