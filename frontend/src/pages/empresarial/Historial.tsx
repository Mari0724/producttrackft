import { useEffect, useState } from "react";
import InventoryHistory from "../../components/producttrack/InventoryHistory";
import type { InventoryChange } from "../../types/Inventory";
import { getHistorialInventario } from "../../api/historial";

const HistorialIndividual = () => {
  const [changes, setChanges] = useState<InventoryChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idUsuario = parseInt(localStorage.getItem("idUsuario") || "0");
    if (!idUsuario) return;

    getHistorialInventario(idUsuario)
      .then(setChanges)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando historial...</p>;

  return (
    <div className="p-6">
      <InventoryHistory changes={changes} />
    </div>
  );
};

export default HistorialIndividual;