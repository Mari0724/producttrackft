import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { url } from '../../constants';

interface Respuesta {
  mensaje: string;
  generadoPor: string;
}

interface Registro {
  id: number;
  consulta: string;
  respuesta: Respuesta | null;
  fechaAnalisis: string;
  esAlimento: boolean;
  tipoAnalisis: "ocr-gpt-only" | "ocr-openfoodfacts-gpt";
  isTest?: boolean;
  usuario: {
    nombreCompleto: string;
    tipoUsuario: "INDIVIDUAL";
  };
}

const NutriScanAuditoria = () => {
  const { usuario } = useUser();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [registroEditando, setRegistroEditando] = useState<Registro | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmEliminarId, setConfirmEliminarId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cargarTodos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await axios.get<Registro[]>(`${url}/nutriscan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRegistros(res.data);
  };

  const buscarPorUsuarioId = async () => {
    if (!usuarioId.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await axios.get<Registro[]>(`${url}/nutriscan/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.length === 0 || res.data[0].usuario.tipoUsuario !== "INDIVIDUAL") {
      setError("Este usuario no tiene acceso a esta funcionalidad.");
      setRegistros([]);
    } else {
      setError(null);
      setRegistros(res.data);
    }
  };

  const limpiarFiltros = () => {
    setUsuarioId("");
    setFiltroNombre("");
    setFiltroFecha("");
    setError(null);
    cargarTodos();
  };

  const manejarEditar = (registro: Registro) => {
    setRegistroEditando({
      ...registro,
      respuesta: registro.respuesta ?? { mensaje: "", generadoPor: "GPT" },
      isTest: registro.isTest ?? false,
    });
    setModalAbierto(true);
  };

  const guardarCambios = async () => {
    if (!registroEditando) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const datosActualizados = {
      consulta: registroEditando.consulta,
      respuesta: {
        mensaje: registroEditando.respuesta?.mensaje,
        generadoPor: registroEditando.respuesta?.generadoPor || "GPT"
      },
      tipoAnalisis: registroEditando.tipoAnalisis,
      esAlimento: registroEditando.esAlimento,
      isTest: registroEditando.isTest,
    };

    await axios.put(
      `${url}/nutriscan/${registroEditando.id}`,
      datosActualizados,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setModalAbierto(false);
    cargarTodos();
  };

  const confirmarEliminar = (id: number) => setConfirmEliminarId(id);

  const eliminarRegistro = async () => {
    if (confirmEliminarId == null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios.delete(`${url}/nutriscan/${confirmEliminarId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setConfirmEliminarId(null);
    cargarTodos();
  };

  useEffect(() => {
    cargarTodos();
  }, []);

  if (usuario?.rol !== "ADMIN" && usuario?.rol !== "DESARROLLADOR") {
    return <div className="text-center mt-20 text-red-600">Sin permisos para ver esta página 😢</div>;
  }

  const registrosFiltrados = registros.filter((r) => {
    const nombreOk = r.usuario.nombreCompleto.toLowerCase().includes(filtroNombre.toLowerCase());
    const fechaOk = filtroFecha ? r.fechaAnalisis.startsWith(filtroFecha) : true;
    return nombreOk && fechaOk;
  });

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-wine-red">🧾 Auditoría de Análisis Nutricionales</h1>
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="number"
          placeholder="Buscar por ID de usuario"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          className="border rounded px-3 py-2 w-52"
        />
        <button
          onClick={buscarPorUsuarioId}
          className="bg-wine-red text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
        <button
          onClick={limpiarFiltros}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Limpiar
        </button>
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border">
          <thead className="bg-wine-red text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Consulta</th>
              <th className="px-4 py-2">Respuesta GPT</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2 break-words">{r.consulta}</td>
                <td className="px-3 py-2 break-words">{r.respuesta?.mensaje || "Sin respuesta"}</td>
                <td className="px-3 py-2">{r.usuario.nombreCompleto}</td>
                <td className="px-3 py-2">{new Date(r.fechaAnalisis).toLocaleString()}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => manejarEditar(r)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => confirmarEliminar(r.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && registroEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl mb-4 font-semibold">Editar #{registroEditando.id}</h2>
            <div className="space-y-3">
              <input type="text" value={registroEditando.consulta}
                onChange={(e) => setRegistroEditando({ ...registroEditando, consulta: e.target.value })}
                className="border w-full p-2 rounded" placeholder="Consulta" />
              <textarea value={registroEditando.respuesta?.mensaje || ""}
                onChange={(e) => setRegistroEditando({ ...registroEditando, respuesta: { mensaje: e.target.value, generadoPor: registroEditando.respuesta?.generadoPor || "GPT" } })}
                className="border w-full p-2 rounded" placeholder="Respuesta GPT" />
              <select value={registroEditando.tipoAnalisis}
                onChange={(e) => setRegistroEditando({ ...registroEditando, tipoAnalisis: e.target.value as "ocr-gpt-only" | "ocr-openfoodfacts-gpt" })}
                className="border w-full p-2 rounded">
                <option value="ocr-gpt-only">ocr-gpt-only</option>
                <option value="ocr-openfoodfacts-gpt">ocr-openfoodfacts-gpt</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={registroEditando.esAlimento} onChange={(e) => setRegistroEditando({ ...registroEditando, esAlimento: e.target.checked })} /> Es alimento
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={registroEditando.isTest ?? false} onChange={(e) => setRegistroEditando({ ...registroEditando, isTest: e.target.checked })} /> Es test
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setModalAbierto(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                <button onClick={guardarCambios} className="px-4 py-2 bg-wine-red text-white rounded">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmEliminarId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg mb-4">¿Eliminar este análisis?</h2>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmEliminarId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={eliminarRegistro} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutriScanAuditoria;