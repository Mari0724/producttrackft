export function puedeNotificar(tipo: string): boolean {
  const guardadas = localStorage.getItem("preferenciasNotificaciones");
  if (!guardadas) return true; // si no hay preferencias, se permite todo
  const prefs = JSON.parse(guardadas);
  return prefs[tipo] !== false;
}