import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Mail, Phone, User, Search } from "lucide-react";
import type { TeamMember } from "../../types/team";
import { AddMemberModal } from "../../components/team/AddMemberModal";
import { EditMemberModal } from "../../components/team/EditMemberModal";
import { DeleteConfirmModal } from "../../components/team/DeleteConfirmModal";
import { useUser } from "../../context/UserContext";
import { createTeamMember, getAllTeamMembers, updateTeamMember, deleteTeamMember, type CreateTeamMemberDTO, } from "../../services/teamService";
import { useToast } from "../../hooks/useToast";

interface TeamMemberWithStatus extends TeamMember {
  phone?: string;
}

interface MemberFromAPI {
  idUsuario: number;
  nombreCompleto: string;
  correo: string;
  rolEquipo: "LECTOR" | "COMENTARISTA" | "EDITOR";
  estado: "activo" | "inactivo";
  telefono?: string;
  empresaId: number;
  rol: string;
}

const TeamManagement = () => {
  const { usuario, refreshUsuario, cargando } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithStatus[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { toast } = useToast();


  const fetchMembers = useCallback(async () => {
    if (!usuario) return;

    const empresaId = usuario.empresaId ?? usuario.idUsuario;

    try {
      const members = await getAllTeamMembers();
      const parsed: TeamMemberWithStatus[] = members
        .filter((m: MemberFromAPI) =>
          m.rol === "EQUIPO" &&
          m.empresaId === empresaId &&
          m.estado === "activo" &&
          m.idUsuario != null
        )
        .map((m: MemberFromAPI) => ({
          id: m.idUsuario.toString(),
          name: m.nombreCompleto,
          email: m.correo,
          role: m.rolEquipo,
          estado: m.estado || "activo",
          phone: m.telefono,
        }));

      setTeamMembers(parsed);
    } catch (error) {
      console.error("❌ Error al obtener los miembros del equipo:", error);
    }
  }, [usuario]);



  useEffect(() => {
    if (!cargando && usuario?.idUsuario) {
      fetchMembers();
    }
  }, [cargando, usuario, fetchMembers]);

  const handleAddMember = async (
    data: Omit<TeamMember, "id"> & { password: string; perfilCompleto?: boolean }
  ) => {
    try {
      const payload: CreateTeamMemberDTO = {
        username: data.email.split("@")[0],
        correo: data.email,
        password: data.password,
        nombreCompleto: data.name,
        rolEquipo: data.role as "LECTOR" | "COMENTARISTA" | "EDITOR",
        telefono: "0000000000",
        direccion: "pendiente",
        empresaId: usuario?.idUsuario,
        perfilCompleto: data.perfilCompleto ?? true,
      };

      const created = await createTeamMember(payload);
      console.log("Miembro creado por el backend:", created);

      await refreshUsuario();
      await fetchMembers();
      toast(`✅ ${data.name} agregado al equipo.`);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("❌ Error al agregar el miembro:", error);
      toast("❌ Error al agregar el miembro. Intenta de nuevo.");
    }
  };

  const handleEditMember = async (updatedData: Omit<TeamMember, "id">) => {

    if (!selectedMember) return;

    try {
      // Llama al backend para actualizar
      await updateTeamMember(Number(selectedMember.id), {
        nombreCompleto: updatedData.name,
        correo: updatedData.email,
        rolEquipo: updatedData.role,
      });

      // Actualiza el estado local
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? { ...m, name: updatedData.name, email: updatedData.email, role: updatedData.role }
            : m
        )
      );

      toast(`✅ ${updatedData.name} actualizado correctamente.`);
      setIsEditModalOpen(false);
      setSelectedMember(null);
      refreshUsuario();
    } catch (err) {
      console.error("❌ Error actualizando miembro:", err);
      toast("❌ No se pudo actualizar el miembro.");
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteTeamMember(Number(id));
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      toast("✅ Miembro eliminado correctamente.");
    } catch (error) {
      console.error("❌ Error al eliminar miembro:", error);
      toast("❌ No se pudo eliminar el miembro.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    }
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!usuario || usuario.tipoUsuario !== "EMPRESARIAL" || usuario.rol !== "USUARIO") {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Acceso no autorizado</h2>
        <p className="text-gray-700 mt-2">
          Esta sección está disponible solo para empresas con rol de usuario.
        </p>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-20">
        <User className="h-24 w-24 text-producttrack-olive mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-producttrack-olive mb-4 font-nunito">
          ¡Bienvenido a la gestión de tu equipo!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Comienza creando tu primer miembro del equipo para colaborar en ProductTrack.
        </p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-producttrack-olive hover:bg-producttrack-olive/90 text-white text-lg px-8 py-3 rounded flex items-center gap-2 mx-auto"
        >
          <Plus className="h-5 w-5" /> Crear Primer Miembro
        </button>
        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMember}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-producttrack-olive">Gestión de Equipo</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-producttrack-olive hover:bg-producttrack-olive/90 text-white text-sm px-4 py-2 rounded flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Nuevo Miembro
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-producttrack-olive"
        />
      </div>

      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-200 rounded-xl p-4 gap-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-producttrack-olive/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-producttrack-olive" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-producttrack-olive truncate">{member.name}</h2>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${member.role === "EDITOR" ? "bg-producttrack-olive text-white" : member.role === "COMENTARISTA" ? "bg-producttrack-yellow text-black" : "bg-gray-300 text-gray-800"}`} >{member.role} </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{member.email}</span>
                  </span>
                  {member.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setIsEditModalOpen(true);
                }}
                className="border border-producttrack-olive text-producttrack-olive hover:bg-producttrack-olive/10 p-2 rounded"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setIsDeleteModalOpen(true);
                }}
                className="border border-producttrack-wine text-producttrack-wine hover:bg-producttrack-wine/10 p-2 rounded"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-20">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-500">No hay miembros que coincidan con tu búsqueda.</p>
        </div>
      )}

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        member={selectedMember}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        onEdit={handleEditMember}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        member={selectedMember}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={() => {
          if (selectedMember) handleDeleteMember(selectedMember.id);
        }}
      />
    </div>
  );
};

export default TeamManagement;