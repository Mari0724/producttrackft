import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { Trash, Pencil } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { url } from '../../constants';

interface Usuario {
    idUsuario: number;
    username: string;
    nombreCompleto: string;
    correo: string;
    rol: "USUARIO" | "EQUIPO" | "ADMIN" | "DESARROLLADOR";
    tipoUsuario?: "INDIVIDUAL" | "EMPRESARIAL";
    estado: "activo" | "inactivo";
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

const UsuarioAuditoria = () => {
    const { usuario } = useUser();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [confirmEliminarId, setConfirmEliminarId] = useState<number | null>(null);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCorreo, setFiltroCorreo] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [confirmReactivarId, setConfirmReactivarId] = useState<number | null>(null);

    const { toast } = useToast();

    const filtrarUsuarios = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.get(`${url}/usuarios`, {
                params: {
                    nombreCompleto: filtroNombre || undefined,
                    correo: filtroCorreo || undefined,
                    tipoUsuario: filtroTipo || undefined,
                    rol: filtroRol || undefined,
                    estado: filtroEstado || undefined,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsuarios(res.data as Usuario[]);

        } catch (error) {
            console.error(error);
            toast("❌ Error al filtrar usuarios.");
        }
    };

    const cargarUsuarios = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${url}/usuarios`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data as Usuario[]);
    };

    const eliminarUsuario = async () => {
        if (confirmEliminarId == null) return;
        if (confirmEliminarId === usuario?.idUsuario) {
            toast("⚠️ No puedes eliminarte a ti mismo.");
            setConfirmEliminarId(null);
            return;
        }
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${url}/usuarios/${confirmEliminarId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast("✅ Usuario marcado como inactivo.");
            setConfirmEliminarId(null);
            cargarUsuarios();
        } catch {
            toast("❌ No se pudo inactivar el usuario.");
        }
    };

    const reactivarUsuario = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await axios.put(
                `${url}/usuarios/${id}/reactivar`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast("✅ Usuario reactivado.");
            cargarUsuarios();
        } catch {
            toast("❌ No se pudo reactivar el usuario.");
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const esAdmin = usuario?.rol === "ADMIN";
    if (!esAdmin) {
        return <div className="text-center mt-20 text-red-600">Sin permisos para ver esta auditoría.</div>;
    }

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-wine-red">👤 Auditoría de Usuarios</h1>
            <div className="flex flex-wrap gap-3 mb-4">
                <input type="text" placeholder="Nombre" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} className="border rounded px-3 py-2" />
                <input type="text" placeholder="Correo" value={filtroCorreo} onChange={(e) => setFiltroCorreo(e.target.value)} className="border rounded px-3 py-2" />
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="border rounded px-3 py-2">
                    <option value="">Todos los tipos</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="EMPRESARIAL">Empresarial</option>
                </select>
                <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="border rounded px-3 py-2">
                    <option value="">Todos los roles</option>
                    <option value="USUARIO">Usuario</option>
                    <option value="EMPRESARIAL">Empresarial</option>
                    <option value="ADMIN">Admin</option>
                    <option value="DESARROLLADOR">Desarrollador</option>
                </select>
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="border rounded px-3 py-2">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
                <button onClick={filtrarUsuarios} className="bg-wine-red text-white px-4 py-2 rounded">Filtrar</button>
                <button onClick={cargarUsuarios} className="bg-gray-300 px-4 py-2 rounded">Limpiar</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full border text-sm bg-white">
                    <thead className="bg-wine-red text-white">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Usuario</th>
                            <th className="px-4 py-2">Nombre</th>
                            <th className="px-4 py-2">Correo</th>
                            <th className="px-4 py-2">Rol</th>
                            <th className="px-4 py-2">Tipo</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Creado</th>
                            <th className="px-4 py-2">Actualizado</th>
                            <th className="px-4 py-2">Eliminado</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u: Usuario) => (
                            <tr key={u.idUsuario} className="border-t text-center">
                                <td className="px-3 py-2">{u.idUsuario}</td>
                                <td className="px-3 py-2">{u.username}</td>
                                <td className="px-3 py-2">{u.nombreCompleto}</td>
                                <td className="px-3 py-2">{u.correo}</td>
                                <td className="px-3 py-2">{u.rol}</td>
                                <td className="px-3 py-2">{u.tipoUsuario || "-"}</td>
                                <td className="px-3 py-2">{u.estado}</td>
                                <td className="px-3 py-2">{new Date(u.createdAt).toLocaleString()}</td>
                                <td className="px-3 py-2">{new Date(u.updatedAt).toLocaleString()}</td>
                                <td className="px-3 py-2">{u.deletedAt ? new Date(u.deletedAt).toLocaleString() : "-"}</td>
                                <td className="px-3 py-2 flex justify-center gap-2">
                                    {esAdmin && u.estado === "activo" && u.rol !== "ADMIN" && u.rol !== "DESARROLLADOR" && usuario?.idUsuario !== u.idUsuario && (
                                        <button onClick={() => setConfirmEliminarId(u.idUsuario)} title="Inactivar usuario">
                                            <Trash size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setConfirmReactivarId(u.idUsuario)}
                                        title="Reactivar usuario"
                                    >
                                        <Pencil size={16} className="text-green-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirmEliminarId !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-red-600 mb-4">⚠️ Inactivar usuario</h2>
                        <p className="mb-4 text-sm">El usuario no podrá acceder al sistema, pero su información será conservada.</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmEliminarId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                            <button onClick={eliminarUsuario} className="px-4 py-2 bg-red-600 text-white rounded">Inactivar</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmReactivarId !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                        <h2 className="text-lg font-semibold text-green-600 mb-4">✔️ Reactivar usuario</h2>
                        <p className="mb-4 text-sm">¿Seguro que deseas reactivar este usuario? Recuperará acceso al sistema.</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmReactivarId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                            <button
                                onClick={() => {
                                    reactivarUsuario(confirmReactivarId);
                                    setConfirmReactivarId(null);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Reactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsuarioAuditoria;