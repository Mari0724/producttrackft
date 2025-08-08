import { useState, useRef, useEffect } from 'react';
import { Bell, Edit, X, MessageSquare, Check } from 'lucide-react';
import { getNotificacionesUsuario, marcarNotificacionLeida, getProductosDelUsuario, getPreferenciasUsuario } from "../../api/notificaciones";

interface Notification {
    idNotificacion: number;
    tipo: string;
    titulo: string;
    mensaje: string;
    leida: boolean;
    fechaEnvio: string;
}

const NotificationBell = () => {
    const tipoUsuario = localStorage.getItem("tipoUsuario") ?? 'EMPRESARIAL';
    const [isOpen, setIsOpen] = useState(false);
    const toggleBell = () => {
        setIsOpen(!isOpen);
    };
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const cerrarModal = () => setSelectedNotification(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);
    const [nombresProductosUsuario, setNombresProductosUsuario] = useState<string[]>([]);

    const [preferencias, setPreferencias] = useState({
        stockBajo: true,
        productoVencido: true,
        comentarios: true,
        reposicion: true,
        actualizacion: true,
    });

    // Aplica filtro según el tipo de usuario
    const notificacionesFiltradas = notifications.filter((n) => {
        const preferenciasActivas: Record<string, boolean> = {
            STOCK_BAJO: preferencias.stockBajo,
            PRODUCTO_VENCIDO: preferencias.productoVencido,
            COMENTARIO_EQUIPO: preferencias.comentarios,
            REPOSICION_RECOMENDADA: preferencias.reposicion,
            ACTUALIZACION_APP: preferencias.actualizacion,
        };

        if (!preferenciasActivas[n.tipo]) return false;

        if (tipoUsuario === 'INDIVIDUAL') {
            const tiposPermitidos = ['PRODUCTO_VENCIDO', 'REPOSICION_RECOMENDADA', 'STOCK_BAJO', 'ACTUALIZACION_APP'];
            const contieneProducto = nombresProductosUsuario.some(nombre =>
                n.mensaje.toLowerCase().includes(nombre.toLowerCase())
            );

            return n.tipo === 'ACTUALIZACION_APP' || (tiposPermitidos.includes(n.tipo) && contieneProducto);
        }

        return true;
    });

    const unreadCount = notificacionesFiltradas.filter(n => !n.leida).length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idUsuario = Number(localStorage.getItem("idUsuario"));
                const data = await getNotificacionesUsuario(idUsuario);
                const notificaciones = Array.isArray(data) ? data : data.notificaciones || [];
                setNotifications(notificaciones);

                // Traer las preferencias del usuario
                const prefs = await getPreferenciasUsuario(idUsuario);
                setPreferencias(prefs);

                if (tipoUsuario === 'INDIVIDUAL') {
                    const productos = await getProductosDelUsuario(idUsuario);
                    setNombresProductosUsuario(productos);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, [tipoUsuario]);

    const getIcon = (tipo: Notification['tipo']) => {
        switch (tipo) {
            case 'STOCK_BAJO':
            case 'REPOSICION_RECOMENDADA':
                return <Edit className="w-4 h-4 text-olive-green" />;
            case 'PRODUCTO_VENCIDO':
                return <X className="w-4 h-4 text-wine-dark" />;
            case 'COMENTARIO_EQUIPO':
                return <MessageSquare className="w-4 h-4 text-mustard-yellow" />;
            case 'ACTUALIZACION_APP':
                return <Bell className="w-4 h-4 text-sky-500" />;
            default:
                return <Edit className="w-4 h-4 text-gray-400" />;
        }
    };

    const getIconBg = (tipo: Notification['tipo']) => {
        switch (tipo) {
            case 'STOCK_BAJO':
            case 'REPOSICION_RECOMENDADA':
                return 'bg-olive-green/10';
            case 'PRODUCTO_VENCIDO':
                return 'bg-wine-dark/10';
            case 'COMENTARIO_EQUIPO':
                return 'bg-mustard-yellow/10';
            case 'ACTUALIZACION_APP':
                return 'bg-sky-500/10';
            default:
                return 'bg-gray-300/10';
        }
    };


    const formatTimestamp = (timestampString: string) => {
        const timestamp = new Date(timestampString);
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMins < 60) {
            return `hace ${diffMins} min`;
        } else if (diffHours < 24) {
            return `hace ${diffHours}h`;
        } else {
            return timestamp.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            await marcarNotificacionLeida(notificationId); // Marca como leída en el backend
            setNotifications(prev =>
                prev.map(notification =>
                    notification.idNotificacion === notificationId
                        ? { ...notification, leida: true } // Actualiza visualmente
                        : notification
                )
            );
        } catch (error) {
            console.error("Error al marcar como leída:", error);
        }
    };

    return (
        <div className="relative">
            {selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white-pure rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
                        <button
                            onClick={cerrarModal}
                            className="absolute top-3 right-3 text-gray-dark hover:text-wine-dark"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-gray-dark mb-2">
                            {selectedNotification.titulo}
                        </h2>

                        <p className="text-gray-dark/80 mb-4 whitespace-pre-wrap">
                            {selectedNotification.mensaje}
                        </p>

                        <p className="text-xs text-gray-dark/50">
                            {formatTimestamp(selectedNotification.fechaEnvio)}
                        </p>
                    </div>
                </div>
            )}

            {/* Campanita */}
            <button
                ref={bellRef}
                onClick={toggleBell}
                className={`
                relative p-2 rounded-lg transition-all duration-200 
                hover:bg-gray-light/20 hover:scale-105 active:scale-95
                ${unreadCount > 0 ? 'animate-bell-ring' : ''}
                `}
            >
                <Bell className="w-6 h-6 text-gray-dark hover:text-wine-dark transition-colors" />

                {/* Contador de notificaciones no leídas */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-wine-dark text-white-pure text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown de notificaciones */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 top-12 w-80 bg-white-pure rounded-xl shadow-2xl border border-gray-light/30 z-50 animate-fade-in"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-light/30">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-dark text-lg">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <span className="text-sm text-wine-dark font-medium">
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-96 overflow-y-auto">
                        {notificacionesFiltradas.length === 0 ? (
                            <div className="p-6 text-center text-gray-dark/60">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No hay notificaciones</p>
                            </div>
                        ) : (
                            notificacionesFiltradas.map((notification) => (
                                <div
                                    key={notification.idNotificacion}
                                    onClick={() => {
                                        setSelectedNotification(notification);
                                        markAsRead(notification.idNotificacion);
                                    }}
                                    className={`
                                        p-4 border-b border-gray-light/20 hover:bg-gray-light/10 
                                        transition-colors cursor-pointer relative
                                        ${!notification.leida ? 'bg-mustard-yellow/5' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icono de la acción */}
                                        <div className={`p-2 rounded-lg ${getIconBg(notification.tipo)} flex-shrink-0`}>
                                            {getIcon(notification.tipo)}
                                        </div>

                                        {/* Contenido de la notificación */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-medium text-gray-dark text-sm truncate">
                                                    {notification.titulo}
                                                </h4>
                                                {!notification.leida && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification.idNotificacion);
                                                        }}
                                                        className="p-1 rounded-full hover:bg-olive-green/10 transition-colors flex-shrink-0"
                                                        title="Marcar como leída"
                                                    >
                                                        <Check className="w-4 h-4 text-olive-green" />
                                                    </button>
                                                )}
                                            </div>

                                            <p className="text-wine-dark font-medium text-sm mt-1 truncate">
                                                {notification.mensaje}
                                            </p>

                                            <p className="text-gray-dark/60 text-xs mt-1">
                                                {formatTimestamp(notification.fechaEnvio)}
                                            </p>
                                        </div>

                                        {/* Indicador de no leída */}
                                        {!notification.leida && (
                                            <div className="w-2 h-2 bg-wine-dark rounded-full flex-shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;