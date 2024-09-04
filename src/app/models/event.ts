export interface Event {
    id: number;
    eventName: string;
    fecha: string; // Usar formato ISO para fecha
    hora: string; // Usar formato ISO para hora
    lugar: string;
    tipo: string;
    cupo: number;
  }
  