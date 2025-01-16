export interface reservation { 
    personneId: string;
    vehiculeId: string;
    totalMontant: number;
    type: string;
    dateDebut: string;
    heureDebut: string;
    dateFin: string;
    heureFin: string;
    status: "Encours" | "Confirmer" | "Terminer" | "Annuler";
  }