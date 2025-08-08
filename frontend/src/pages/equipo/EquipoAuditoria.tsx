import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { Pencil, Trash } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { url } from '../../constants';

interface MiembroEquipo {
    idUsuario: number;
    nombreCompleto: string;
    correo: string;
    rolEquipo: "LECTOR" | "COMENTARISTA" | "EDITOR";
    estado: "activo" | "inactivo";
    perfilCompleto: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    empresaId: number;
}

const roles: MiembroEquipo["rolEquipo"][] = ["LECTOR", "COMENTARISTA", "EDITOR"];

const EquipoAuditoria = () => {
    const { usuario } = useUser();
    const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCorreo, setFiltroCorreo] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [confirmEliminarId, setConfirmEliminarId] = useState<number | null>(null);
    const [editar, setEditar] = useState<MiembroEquipo | null>(null);
    const [nuevoRol, setNuevoRol] = useState("");
    const [nuevoPerfilCompleto, setNuevoPerfilCompleto] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroPerfilCompleto, setFiltroPerfilCompleto] = useState("");
    const [activarUsuario, setActivarUsuario] = useState(false);
    const { toast } = useToast();

    const cargarMiembros = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${url}/equipo`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setMiembros(res.data);
    };

    const filtrar = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${url}/equipo/filtrar`, {
            params: {
                nombreCompleto: filtroNombre,
                correo: filtroCorreo,
                rolEquipo: filtroRol || undefined,
                estado: filtroEstado || undefined,
                perfilCompleto: filtroPerfilCompleto || undefined,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        setMiembros(res.data);
    };

    const actualizarRol = async () => {
        if (!editar || !nuevoRol) return;
        const token = localStorage.getItem("token");

        try {
            // Solo activa si tú lo decides
            if (editar.estado === "inactivo" && activarUsuario) {
                await axios.put(
                    `${url}/usuarios/${editar.idUsuario}/reactivar`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            await axios.put(
                `${url}/equipo/${editar.idUsuario}`,
                {
                    rolEquipo: nuevoRol,
                    perfilCompleto: nuevoPerfilCompleto,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast(`✅ actualizado para ${editar.nombreCompleto}`);
            setEditar(null);
            setNuevoRol("");
            setActivarUsuario(false); // importante limpiar
            cargarMiembros();
        } catch (error) {
            console.error(error);
            toast("❌ No se pudo actualizar el miembro.");
        }
    };

    const eliminar = async () => {
        const token = localStorage.getItem("token");
        if (!token || confirmEliminarId == null) return;

        try {
            await axios.delete(
                `${url}/equipo/eliminar-logico/${confirmEliminarId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast("✅ Usuario eliminado.");
            setConfirmEliminarId(null);
            cargarMiembros();
        } catch (error) {
            console.error("Error eliminando físicamente:", error);
            toast("❌ No se pudo eliminar el usuario.");
        }
    };

    useEffect(() => {
        cargarMiembros();
    }, []);

    const esAutorizado = usuario?.rol === "ADMIN" || usuario?.rol === "DESARROLLADOR";

    if (!esAutorizado) {
        toast("⚠️ No tienes permisos para acceder a esta auditoría.");
        return <div className="text-center mt-20 text-red-600">Sin permisos para ver esta auditoría.</div>;
    }

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-wine-red">👥 Auditoría del Equipo</h1>
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Correo"
                    value={filtroCorreo}
                    onChange={(e) => setFiltroCorreo(e.target.value)}
                    className="border rounded px-3 py-2"
                />
                <select
                    value={filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Todos los roles</option>
                    {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
                <select
                    value={filtroPerfilCompleto}
                    onChange={(e) => setFiltroPerfilCompleto(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Todos los perfiles</option>
                    <option value="false">Perfil completo</option>
                    <option value="true">Perfil incompleto</option>
                </select>

                <button
                    onClick={filtrar}
                    className="bg-wine-red text-white px-4 py-2 rounded"
                >
                    Filtrar
                </button>
                <button
                    onClick={() => {
                        setFiltroNombre("");
                        setFiltroCorreo("");
                        setFiltroRol("");
                        setFiltroEstado("");
                        setFiltroPerfilCompleto("");
                        cargarMiembros();
                    }}
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    Limpiar
                </button>
            </div>
            <table className="min-w-[1000px] w-full border text-sm bg-white">                <thead className="bg-wine-red text-white">
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Correo</th>
                    <th className="px-4 py-2">Rol</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Empresa ID</th>
                    <th className="px-4 py-2">Completo</th>
                    <th className="px-4 py-2">Creado</th>
                    <th className="px-4 py-2">Actualizado</th>
                    <th className="px-4 py-2">Eliminado</th>
                    <th className="px-4 py-2">Acciones</th>
                </tr>
            </thead>
                <tbody>
                    {miembros.map((m) => (
                        <tr key={m.idUsuario} className="border-t">
                            <td className="px-3 py-2 text-center">{m.idUsuario}</td>
                            <td className="px-3 py-2">{m.nombreCompleto}</td>
                            <td className="px-3 py-2">{m.correo}</td>
                            <td className="px-3 py-2">{m.rolEquipo}</td>
                            <td className="px-3 py-2">{m.estado}</td>
                            <td className="px-3 py-2 text-center">{m.empresaId}</td>
                            <td className="px-3 py-2">
                                {m.perfilCompleto ? "Incompleto" : "Completo"}
                            </td>                            <td>{new Date(m.createdAt).toLocaleString()}</td>
                            <td>{new Date(m.updatedAt).toLocaleString()}</td>
                            <td>{m.deletedAt ? new Date(m.deletedAt).toLocaleString() : "-"}</td>
                            <td className="px-3 py-2 flex gap-2">
                                <button onClick={() => { setEditar(m); setNuevoRol(m.rolEquipo); }} className="text-blue-600"><Pencil size={16} /></button>
                                {usuario?.rol === "ADMIN" && (
                                    <button
                                        onClick={() => setConfirmEliminarId(m.idUsuario)}
                                        className="text-red-600"
                                        title="Eliminar permanentemente"
                                    >
                                        <Trash size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Editar miembro: {editar.nombreCompleto}</h2>

                        <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} className="w-full border p-2 rounded mb-4">
                            {roles.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>

                        <select
                            value={nuevoPerfilCompleto ? "true" : "false"}
                            onChange={(e) => setNuevoPerfilCompleto(e.target.value === "true")}
                            className="w-full border p-2 rounded mb-4"
                        >
                            <option value="false">Perfil completo</option>
                            <option value="true">Perfil incompleto</option>
                        </select>

                        {editar.estado === "inactivo" && (
                            <div className="mb-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={activarUsuario}
                                        onChange={(e) => setActivarUsuario(e.target.checked)}
                                        className="accent-wine-red"
                                    />
                                    <span>Activar este usuario</span>
                                </label>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditar(null)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                            <button onClick={actualizarRol} className="px-4 py-2 bg-wine-red text-white rounded">Guardar</button>
                        </div>
                    </div>
                </div>
            )
            }

            {confirmEliminarId !== null && usuario?.rol === "ADMIN" && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-lg font-semibold text-red-600 mb-4">
                            ⚠️ Esta acción marcará al usuario como <span className="font-bold">inactivo</span>.                        </h2>
                        <p className="mb-4 text-sm text-gray-700">
                            El usuario no podrá acceder al sistema, pero su información será conservada.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmEliminarId(null)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminar}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default EquipoAuditoria;