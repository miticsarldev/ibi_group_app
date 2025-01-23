export interface trajet {
    id: string;
    personneId: string;
    clientLat: number;
    clientLon: number;
    destinationLat: number;
    destinationLon: number;
    destination: string,
    type: string,
    nmbrePers: number,
    prix: number,
    otpCode: string;
    statut: "Encours"  | "diponible" | "accepter" | "refuser";
    [key: string]: any;
  }