export interface historiqueTrajet {
    trajetId: string;
    chauffeurId: string;
    statut: "Encours" | "Terminer";
    chauffeurLat: number;
    chauffeurLon: number;
    clientLat: number;
    clientLon: number;
    destinationLat: number;
    destinationLon: number;
    createdAt: string;
  }
  