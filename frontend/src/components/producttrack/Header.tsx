import NotificationBell from '../producttrack/NotificationBell';

const Header = () => {
  return (
    <header className="bg-white-pure border-b border-gray-light/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-wine-dark rounded-lg flex items-center justify-center">
              <span className="text-white-pure font-bold text-sm">PT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-dark">
              Product<span className="text-wine-dark">Track</span>
            </h1>
          </div>

          {/* Sección derecha con notificaciones */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center text-sm text-gray-dark/60">
              <span>Panel de Control</span>
            </div>
            
            {/* Campanita de notificaciones */}
            <NotificationBell />
            
            {/* Avatar de usuario (opcional) */}
            <div className="w-8 h-8 bg-olive-green rounded-full flex items-center justify-center">
              <span className="text-white-pure font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;