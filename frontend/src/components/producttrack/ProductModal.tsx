import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { createPortal } from 'react-dom';
import type { Product } from '../../types/Product';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../hooks/useToast';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData?: Product;
}

const CLOUD_NAME = 'delkfnnil';
const UPLOAD_PRESET = 'productos_imagenes';

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { usuario } = useUser();

  const [form, setForm] = useState<Product>({
    codigoBarras: '',
    codigoQR: '',
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    fechaAdquisicion: '',
    fechaVencimiento: '',
    usuarioId: 0,
    estado: 'DISPONIBLE',
    imagen: '',
    categoria: '',
  });
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // Cuando cambia el usuario, actualiza el usuarioId del formulario
  useEffect(() => {
    if (usuario && form.usuarioId !== usuario.idUsuario) {
      setForm((prev) => ({
        ...prev,
        usuarioId: usuario.idUsuario,
      }));
    }
  }, [usuario, form.usuarioId]);

  // Si estamos editando un producto, rellenar los datos
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        fechaAdquisicion: initialData.fechaAdquisicion.split('T')[0],
        fechaVencimiento: initialData.fechaVencimiento.split('T')[0],
      });
    }
  }, [initialData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'cantidad' ? (value === '' ? 0 : parseInt(value)) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, imagen: data.secure_url }));
      } else {
        toast.error('Error al subir imagen: ' + data.error?.message);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.nombre || !form.descripcion || !form.precio || !form.fechaAdquisicion) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const parsedPrecio = parseFloat(form.precio.toString());
    if (isNaN(parsedPrecio)) {
      toast.error('El precio debe ser un número válido'); return;
    }

    const categoriaLimpia = form.categoria?.trim();

    const productoAEnviar = {
      ...(form.id !== undefined && { id: form.id }),
      codigoBarras: form.codigoBarras?.trim() === '' ? null : form.codigoBarras,
      codigoQR: form.codigoQR?.trim() === '' ? null : form.codigoQR,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      cantidad: form.cantidad,
      precio: parsedPrecio,
      fechaAdquisicion: form.fechaAdquisicion,
      fechaVencimiento: form.fechaVencimiento,
      usuarioId: form.usuarioId,
      estado: form.estado,
      imagen: form.imagen,
      ...(categoriaLimpia ? { categoria: categoriaLimpia } : {}),
    };

    onSave(productoAEnviar);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-start justify-center overflow-auto px-4 py-10">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#81203D]"
        >
          <AiOutlineClose size={22} />
        </button>

        <h2 className="text-2xl font-bold text-[#81203D] mb-4">
          {initialData ? 'Editar producto' : 'Agregar nuevo producto'}
        </h2>

        <div className="space-y-4">
          <InputField label="Código de Barras" name="codigoBarras" value={form.codigoBarras ?? ''} onChange={handleChange} />
          <InputField label="Código QR" name="codigoQR" value={form.codigoQR ?? ''} onChange={handleChange} />
          <InputField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <InputField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} isTextarea />
          <InputField label="Cantidad" name="cantidad" value={form.cantidad.toString()} onChange={handleChange} type="number" />
          <InputField label="Precio" name="precio" value={form.precio.toString()} onChange={handleChange} />
          <InputField label="Fecha de adquisición" name="fechaAdquisicion" value={form.fechaAdquisicion} onChange={handleChange} type="date" />
          <InputField label="Fecha de vencimiento" name="fechaVencimiento" value={form.fechaVencimiento} onChange={handleChange} type="date" />
          <InputField label="Categoría" name="categoria" value={form.categoria || ''} onChange={handleChange} />

          <div>
            <label className="text-sm font-semibold">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-[#81203D]"
            >
              <option value="DISPONIBLE">DISPONIBLE</option>
              <option value="AGOTADO">AGOTADO</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border px-4 py-2 rounded-lg text-sm"
            />
            {uploading ? (
              <p className="text-sm mt-2 text-[#81203D]">Subiendo imagen...</p>
            ) : form.imagen ? (
              <img
                src={form.imagen}
                alt="Vista previa"
                className="mt-3 rounded-lg h-40 object-cover w-full border"
              />
            ) : (
              <div className="w-full h-40 mt-3 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 border">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#81203D] text-white px-4 py-2 rounded text-sm hover:bg-[#9c2c53]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  isTextarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  isTextarea?: boolean;
}) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-[#81203D]"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-[#81203D]"
      />
    )}
  </div>
);

export default ProductModal;