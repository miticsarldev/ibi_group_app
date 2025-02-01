import { Timestamp } from "firebase/firestore";

export interface trajet { 
    userId: string; 
    userLocation : {
      address : string
      latitude:number
      longitude:number
    };
    destination : {
      address : string
      latitude:number
      longitude:number
    };
    type: string, 
    price: string,
    otp: string;
    createdAt: Timestamp;
    status: "Encours"  | "diponible" | "accepter" | "terminer" | "refuser" | "annuler";
    [key: string]: any;
  }