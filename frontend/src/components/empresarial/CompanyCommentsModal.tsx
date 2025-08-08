import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { getComentariosPorProducto, crearComentario } from '../../api/comentarios';
import toast from 'react-hot-toast';

interface Comment {
  id: number;
  text: string;
  user: string;
  date: string;
}

interface CompanyCommentsModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

interface RawComentario {
  id: number;
  comentario: string;
  usuario?: {
    nombre: string;
  };
  createdAt?: string;
}

const CompanyCommentsModal: React.FC<CompanyCommentsModalProps> = ({ productId, productName, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  const userName = localStorage.getItem("userName") || "Usuario";
  const userRol = localStorage.getItem("rolEquipo") || localStorage.getItem("rol") || "";
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  const puedeComentar =
    tipoUsuario === "EMPRESARIAL" ||
    userRol === "EDITOR" ||
    userRol === "COMENTARISTA";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComentariosPorProducto(productId);

        if (Array.isArray(res.data)) {
          const formateados = res.data.map((c: RawComentario): Comment => ({
            id: c.id,
            text: c.comentario || '',
            user: c.usuario?.nombre || 'Usuario',
            date: c.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          }));
          setComments(formateados);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar comentarios");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await crearComentario({
        idUsuario: userId,
        idProducto: productId,
        comentario: newComment,
      });

      setComments(prev => [
        ...prev,
        {
          id: res.data.id,
          text: newComment,
          user: userName,
          date: res.data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        },
      ]);

      setNewComment('');
      toast.success("Comentario enviado y notificado al equipo");
    } catch {
      toast.error("Error al enviar comentario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#81203D]">
          <AiOutlineClose size={22} />
        </button>

        <h2 className="text-xl font-bold text-[#81203D]">
          Comentarios sobre: {productName}
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Cargando comentarios...</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
            {comments.map((c) => (
              <div key={c.id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">{c.text}</p>
                <p className="text-xs text-right text-gray-500">— {c.user}, {c.date}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-gray-500">No hay comentarios aún.</p>
            )}
          </div>
        )}

        {puedeComentar ? (
          <div>
            <textarea
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-[#81203D] hover:bg-[#60162F] text-white px-4 py-2 rounded-lg text-sm"
            >
              Enviar comentario
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Tu rol no tiene permisos para enviar comentarios.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyCommentsModal;