import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { getComentariosPorProducto, crearComentario } from '../../api/comentarios';
import toast from 'react-hot-toast';

// Tipo que viene del backend
type ComentarioDesdeAPI = {
  id: number;
  comentario: string;
  createdAt: string;
  usuario?: {
    nombre: string;
  };
};

// Tipo que usamos en el componente
interface Comment {
  id: number;
  text: string;
  user: string;
  date: string;
}

interface CommentsModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

const ProductCommentsModal: React.FC<CommentsModalProps> = ({ productId, productName, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  const userName = localStorage.getItem("userName") || "Tú";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComentariosPorProducto(productId);

        if (Array.isArray(res.data)) {
          const comentariosFormateados: Comment[] = res.data.map((c: ComentarioDesdeAPI) => ({
            id: c.id,
            text: c.comentario,
            user: c.usuario?.nombre || 'Usuario',
            date: c.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          }));

          setComments(comentariosFormateados);
        } else {
          console.error("La respuesta no es un arreglo:", res.data);
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

      const nuevo: Comment = {
        id: res.data.id,
        text: newComment,
        user: userName,
        date: res.data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      };

      setComments(prev => [...prev, nuevo]);
      setNewComment('');
      toast.success("Comentario enviado");
    } catch (error) {
      console.error(error);
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
          Notas personales sobre: {productName}
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Cargando comentarios...</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">{comment.text}</p>
                <p className="text-xs text-right text-gray-500">— {comment.user}, {comment.date}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-sm text-gray-500">No hay comentarios aún.</p>}
          </div>
        )}

        <div>
          <textarea
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          ></textarea>
          <button
            onClick={handleAddComment}
            className="mt-2 bg-[#81203D] hover:bg-[#60162F] text-white px-4 py-2 rounded-lg text-sm"
          >
            Subir mis notas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCommentsModal;