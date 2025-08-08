import { useEffect, useState } from 'react';
import { ArrowRight, Users, User, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import type { TeamMember } from '../types/team';

interface EmpresaInfo {
    nombreEmpresa: string;
    nit: string;
    telefono: string;
}

const Index = () => {
    const { usuario } = useUser();
    const [empresaData, setEmpresaData] = useState<EmpresaInfo | null>(null);
    const [totalEquipo, setTotalEquipo] = useState(0);
    const [totalEditores, setTotalEditores] = useState(0);
    const [totalComentaristas, setTotalComentaristas] = useState(0);
    const [totalLectores, setTotalLectores] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);
    const [productosStockBajo, setProductosStockBajo] = useState(0);
    const [totalCategorias, setTotalCategorias] = useState(0);
    useEffect(() => {
        const fetchEmpresaInfo = async () => {
            const token = localStorage.getItem("token");
            if (!token || !usuario) return;

            try {
                const headers = { Authorization: `Bearer ${token}` };

                let empresa;

                if (usuario.rol === 'EQUIPO' && usuario.empresaId) {
                    // Si es miembro de equipo
                    const response = await axiosInstance.get(`/usuarios/empresa/${usuario.empresaId}`, { headers });
                    empresa = response.data;
                } else if (usuario.tipoUsuario === 'EMPRESARIAL') {
                    // Si es empresa (admin)
                    const response = await axiosInstance.get(`/usuarios/${usuario.idUsuario}`, { headers });
                    empresa = response.data;
                }

                if (empresa) {
                    setEmpresaData({
                        nombreEmpresa: empresa.nombreEmpresa || 'Sin nombre',
                        nit: empresa.nit || 'Sin NIT',
                        telefono: empresa.telefono || 'Sin teléfono',
                    });
                }
            } catch (error) {
                console.error("❌ Error al obtener datos de empresa:", error);
            }
        };

        fetchEmpresaInfo();
    }, [usuario]);

    // Efecto para obtener el resumen
    useEffect(() => {
        const fetchResumen = async () => {
            if (!usuario || usuario.tipoUsuario !== "EMPRESARIAL") return;
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [todos, editores, comentaristas, lectores] = await Promise.all([
                    axiosInstance.get(`/equipo/filtrar`, { headers }),
                    axiosInstance.get(`/equipo/filtrar?rolEquipo=EDITOR`, { headers }),
                    axiosInstance.get(`/equipo/filtrar?rolEquipo=COMENTARISTA`, { headers }),
                    axiosInstance.get(`/equipo/filtrar?rolEquipo=LECTOR`, { headers }),
                ]);

                setTotalEquipo((todos.data as TeamMember[]).filter((u) => u.estado === "activo").length);
                setTotalEditores((editores.data as TeamMember[]).filter((u) => u.estado === "activo").length);
                setTotalComentaristas((comentaristas.data as TeamMember[]).filter((u) => u.estado === "activo").length);
                setTotalLectores((lectores.data as TeamMember[]).filter((u) => u.estado === "activo").length);

            } catch (error) {
                console.error("❌ Error al cargar resumen del equipo:", error);
            }
        };

        fetchResumen();
    }, [usuario]);

    useEffect(() => {
        const fetchResumenInventario = async () => {
            if (!usuario) return;

            try {
                const res = await axiosInstance.get("/productos");
                const productos = Array.isArray(res.data) ? res.data : res.data?.data ?? [];

                if (!Array.isArray(productos)) {
                    console.error("❌ El backend no devolvió un array:", res.data);
                    return;
                }

                const filtrados = productos.filter((p) => {
                    if (usuario.tipoUsuario === "INDIVIDUAL") {
                        return p.usuario?.idUsuario === usuario.idUsuario;
                    }
                    if (usuario.tipoUsuario === "EMPRESARIAL") {
                        return p.usuario?.tipoUsuario === "EMPRESARIAL";
                    }
                    if (usuario.rol === "EQUIPO" && usuario.empresaId) {
                        return p.usuario?.empresaId === usuario.empresaId;
                    }
                    return false;
                });

                const stockBajo = filtrados.filter((p) => p.cantidad <= 5).length;
                const categoriasUnicas = [...new Set(filtrados.map((p) => p.categoria))];

                setTotalProductos(filtrados.length);
                setProductosStockBajo(stockBajo);
                setTotalCategorias(categoriasUnicas.length);
            } catch (error) {
                console.error("❌ Error al obtener resumen de inventario:", error);
            }
        };

        fetchResumenInventario();
    }, [usuario]);

    return (
        <div className="p-6 bg-[#fffaf0]">
            {/* Hero */}
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-producttrack-olive mb-4 font-nunito">
                    Bienvenido a ProductTrack
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Gestiona tu equipo de trabajo de manera eficiente y mantén toda la información actualizada
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* Gestión de Equipo */}
                {usuario?.tipoUsuario === 'EMPRESARIAL' && !usuario?.rolEquipo && (
                    <div className="border-l-4 border-l-producttrack-olive bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200">
                        <div className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <Users className="h-8 w-8 text-producttrack-olive" />
                                <div>
                                    <h3 className="text-lg font-semibold text-producttrack-olive">Gestión de Equipo</h3>
                                    <p className="text-sm text-gray-500">Administra los miembros de tu equipo</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm">
                                Crea, edita y gestiona los permisos de los miembros de tu equipo de trabajo.
                            </p>
                            <Link to="/app/empresarial/equipo">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-producttrack-olive hover:bg-producttrack-olive/90 text-white rounded-md font-medium transition">
                                    Ir a Gestión de Equipo
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Mi Perfil */}
                <div className="border-l-4 border-l-producttrack-yellow bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200">
                    <div className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <User className="h-8 w-8 text-producttrack-yellow" />
                            <div>
                                <h3 className="text-lg font-semibold text-producttrack-olive">Mi Perfil</h3>
                                <p className="text-sm text-gray-500">Actualiza tu información personal</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">
                            Mantén actualizada tu información de contacto y configuración de cuenta.
                        </p>
                        <Link to="/perfil">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-producttrack-yellow text-producttrack-olive hover:bg-producttrack-yellow/10 rounded-md font-medium transition">
                                Ver Mi Perfil
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Info Empresa */}
                {(usuario?.tipoUsuario === 'EMPRESARIAL' || usuario?.rol === 'EQUIPO') && (
                    <div className="border-l-4 border-l-producttrack-wine bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200">
                        <div className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <Building2 className="h-8 w-8 text-producttrack-wine" />
                                <div>
                                    <h3 className="text-lg font-semibold text-producttrack-olive">Información de Empresa</h3>
                                    <p className="text-sm text-gray-500">Datos corporativos</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong>Empresa:</strong> {empresaData?.nombreEmpresa || 'Cargando...'}</p>
                                <p><strong>NIT:</strong> {empresaData?.nit || 'Cargando...'}</p>
                                {usuario?.tipoUsuario === 'EMPRESARIAL' && (
                                    <p><strong>Teléfono:</strong> {empresaData?.telefono || 'Cargando...'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Resumen del Sistema */}
            {usuario?.tipoUsuario === 'EMPRESARIAL' && !usuario?.rolEquipo && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-producttrack-olive mb-6 font-nunito">Resumen del Sistema</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-producttrack-olive/10 rounded-lg">
                            <div className="text-2xl font-bold text-producttrack-olive">{totalEquipo}</div>
                            <div className="text-sm text-gray-600">Miembros del Equipo</div>
                        </div>
                        <div className="text-center p-4 bg-producttrack-yellow/20 rounded-lg">
                            <div className="text-2xl font-bold text-producttrack-olive">{totalEditores}</div>
                            <div className="text-sm text-gray-600">Editores</div>
                        </div>
                        <div className="text-center p-4 bg-producttrack-wine/10 rounded-lg">
                            <div className="text-2xl font-bold text-producttrack-olive">{totalComentaristas}</div>
                            <div className="text-sm text-gray-600">Comentaristas</div>
                        </div>
                        <div className="text-center p-4 bg-producttrack-lightgray rounded-lg">
                            <div className="text-2xl font-bold text-producttrack-olive">{totalLectores}</div>
                            <div className="text-sm text-gray-600">Lectores</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen de Inventario */}
            {usuario && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                    <h2 className="text-2xl font-semibold text-producttrack-olive mb-6 font-nunito">
                        Resumen de Inventario
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Productos registrados */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold">{totalProductos}</span>
                            <span className="text-sm text-gray-600">Productos Registrados</span>
                        </div>

                        {/* Stock bajo */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold">{productosStockBajo}</span>
                            <span className="text-sm text-gray-600">Stock Bajo (≤ 5)</span>
                        </div>

                        {/* Categorías */}
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold">{totalCategorias}</span>
                            <span className="text-sm text-gray-600">Categorías</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;