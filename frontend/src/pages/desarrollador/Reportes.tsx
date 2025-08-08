import React, { useState } from 'react';
import { Send, Loader2, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { puedeNotificar } from '../../utils/enviarNotificacion';
import { enviarNotificacionActualizacion } from '../../api/notificaciones';

const ReportesDesarrollador = () => {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<{ titulo?: string, mensaje?: string }>({});

  const validarCampos = () => {
    const nuevosErrores: { titulo?: string, mensaje?: string } = {};

    if (!titulo.trim()) {
      nuevosErrores.titulo = 'El título es requerido';
    }

    if (!mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es requerido';
    } else if (mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviarNotificacion = async () => {
    if (!validarCampos()) {
      toast.error('Por favor, completa todos los campos correctamente', {
        style: {
          background: '#7C2D3E',
          color: '#F8F4F0',
          border: '1px solid #E8B4CB',
        },
        iconTheme: {
          primary: '#E8B4CB',
          secondary: '#F8F4F0',
        },
      });
      return;
    }

    setEnviando(true);

    try {
      if (!puedeNotificar("actualizacion")) {
        toast('Notificaciones de actualización desactivadas.', {
          icon: '🔕',
          style: {
            background: '#FDF2F8',
            color: '#7C2D3E',
            border: '1px solid #FBCFE8',
          },
        });
        return;
      }

      await enviarNotificacionActualizacion({ titulo, mensaje });

      toast.success('¡Notificación enviada exitosamente!', {
        style: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #F8F4F0 100%)',
          color: '#7C2D3E',
          border: '1px solid #D4AF37',
          fontWeight: '600',
        },
        iconTheme: {
          primary: '#7C2D3E',
          secondary: '#F8F4F0',
        },
        duration: 4000,
      });

      setTitulo('');
      setMensaje('');
      setErrores({});

    } catch (error) {
      console.error(error);
      toast.error('Error al enviar la notificación. Intenta nuevamente.', {
        style: {
          background: '#7C2D3E',
          color: '#F8F4F0',
          border: '1px solid #E8B4CB',
        },
        iconTheme: {
          primary: '#E8B4CB',
          secondary: '#F8F4F0',
        },
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitulo(e.target.value);
    if (errores.titulo && e.target.value.trim()) {
      setErrores(prev => ({ ...prev, titulo: undefined }));
    }
  };

  const handleMensajeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMensaje(e.target.value);
    if (errores.mensaje && e.target.value.trim().length >= 10) {
      setErrores(prev => ({ ...prev, mensaje: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full mb-6 shadow-lg">
            <Bell className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-900 via-rose-700 to-amber-600 bg-clip-text text-transparent mb-4">
            Enviar Actualización de la App
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Comparte noticias importantes, actualizaciones de funciones y anuncios con todos los usuarios de la aplicación.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-rose-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-900 to-amber-700 p-8">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Send className="w-6 h-6" />
              Nueva Notificación
            </h2>
            <p className="text-rose-100 mt-2">
              Esta notificación será visible para todos los usuarios activos
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Campo Título */}
            <div className="space-y-3">
              <label htmlFor="titulo" className="block text-lg font-semibold text-slate-700">
                Título de la notificación
              </label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={handleTituloChange}
                placeholder="Ej: Nueva función disponible, Mantenimiento programado..."
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg bg-white/50
                  ${errores.titulo
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500'
                    : 'border-rose-200 focus:border-amber-400 focus:bg-white'
                  } 
                  focus:outline-none focus:ring-4 focus:ring-amber-400/20 placeholder-slate-400`}
                disabled={enviando}
              />
              {errores.titulo && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errores.titulo}
                </div>
              )}
            </div>

            {/* Campo Mensaje */}
            <div className="space-y-3">
              <label htmlFor="mensaje" className="block text-lg font-semibold text-slate-700">
                Mensaje de la notificación
              </label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={handleMensajeChange}
                placeholder="Escribe aquí el contenido detallado de tu notificación. Explica las nuevas funciones, cambios importantes o cualquier información relevante para los usuarios..."
                rows={6}
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-lg bg-white/50 resize-none
                  ${errores.mensaje
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500'
                    : 'border-rose-200 focus:border-amber-400 focus:bg-white'
                  } 
                  focus:outline-none focus:ring-4 focus:ring-amber-400/20 placeholder-slate-400`}
                disabled={enviando}
              />
              <div className="flex justify-between items-center">
                {errores.mensaje && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {errores.mensaje}
                  </div>
                )}
                <div className="ml-auto text-sm text-slate-500">
                  {mensaje.length} caracteres
                </div>
              </div>
            </div>

            {/* Botón de Envío */}
            <div className="pt-6">
              <button
                onClick={enviarNotificacion}
                disabled={enviando}
                className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 
                         disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed
                         text-white font-bold py-6 px-8 rounded-2xl text-xl
                         transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl
                         focus:outline-none focus:ring-4 focus:ring-amber-400/50
                         disabled:transform-none disabled:shadow-none
                         flex items-center justify-center gap-4"
              >
                {enviando ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Enviando notificación...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Enviar Notificación
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-6 border border-amber-200/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    Antes de enviar, verifica que:
                  </h3>
                  <ul className="text-slate-600 space-y-1 text-sm">
                    <li>• El título sea claro y descriptivo</li>
                    <li>• El mensaje contenga toda la información necesaria</li>
                    <li>• No haya errores ortográficos</li>
                    <li>• El tono sea apropiado para todos los usuarios</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-500">
            Panel de Desarrollador • Solo visible para usuarios con permisos administrativos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportesDesarrollador;