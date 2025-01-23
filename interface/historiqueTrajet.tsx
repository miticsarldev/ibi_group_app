export interface historiqueTrajet {
    trajetId: string;
    chauffeurId: string;
    statut: "Encours" | "Terminer";
    depart : string,
    destination : string,
    createdAt: string;
    montant: number;
  }
  