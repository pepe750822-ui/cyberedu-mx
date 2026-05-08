export interface Escuela { 
  id: string; 
  nombre: string; 
  tipo: 'UNAM' | 'IPN'; 
  puntaje: number 
}

export const ESCUELAS: Escuela[] = [
    // CCH UNAM
    { id: 'cch_azcapo', nombre: 'CCH Azcapotzalco', tipo: 'UNAM', puntaje: 93 },
    { id: 'cch_naucalpan', nombre: 'CCH Naucalpan', tipo: 'UNAM', puntaje: 87 },
    { id: 'cch_oriente', nombre: 'CCH Oriente', tipo: 'UNAM', puntaje: 94 },
    { id: 'cch_sur', nombre: 'CCH Sur', tipo: 'UNAM', puntaje: 96 },
    { id: 'cch_vallejo', nombre: 'CCH Vallejo', tipo: 'UNAM', puntaje: 95 },
    // ENP UNAM
    { id: 'prepa1', nombre: 'Prepa 1 UNAM', tipo: 'UNAM', puntaje: 100 },
    { id: 'prepa2', nombre: 'Prepa 2 UNAM', tipo: 'UNAM', puntaje: 96 },
    { id: 'prepa3', nombre: 'Prepa 3 UNAM', tipo: 'UNAM', puntaje: 98 },
    { id: 'prepa4', nombre: 'Prepa 4 UNAM', tipo: 'UNAM', puntaje: 94 },
    { id: 'prepa5', nombre: 'Prepa 5 UNAM', tipo: 'UNAM', puntaje: 97 },
    { id: 'prepa6', nombre: 'Prepa 6 UNAM', tipo: 'UNAM', puntaje: 107 },
    { id: 'prepa7', nombre: 'Prepa 7 UNAM', tipo: 'UNAM', puntaje: 95 },
    { id: 'prepa8', nombre: 'Prepa 8 UNAM', tipo: 'UNAM', puntaje: 93 },
    { id: 'prepa9', nombre: 'Prepa 9 UNAM', tipo: 'UNAM', puntaje: 105 },
    // CECyT IPN
    { id: 'cecyt1', nombre: 'CECyT 1 Gonzalo Vázquez', tipo: 'IPN', puntaje: 86 },
    { id: 'cecyt2', nombre: 'CECyT 2 Miguel Bernard', tipo: 'IPN', puntaje: 90 },
    { id: 'cecyt3', nombre: 'CECyT 3 Estanislao Ramírez', tipo: 'IPN', puntaje: 78 },
    { id: 'cecyt4', nombre: 'CECyT 4 Lázaro Cárdenas', tipo: 'IPN', puntaje: 84 },
    { id: 'cecyt5', nombre: 'CECyT 5 Benito Juárez', tipo: 'IPN', puntaje: 85 },
    { id: 'cecyt6', nombre: 'CECyT 6 Miguel Othón', tipo: 'IPN', puntaje: 89 },
    { id: 'cecyt7', nombre: 'CECyT 7 Cuauhtémoc', tipo: 'IPN', puntaje: 80 },
    { id: 'cecyt8', nombre: 'CECyT 8 Narciso Bassols', tipo: 'IPN', puntaje: 88 },
    { id: 'cecyt9', nombre: 'CECyT 9 Juan de Dios Bátiz', tipo: 'IPN', puntaje: 105 },
    { id: 'cecyt10', nombre: 'CECyT 10 Carlos Vallejo', tipo: 'IPN', puntaje: 81 },
    { id: 'cecyt11', nombre: 'CECyT 11 Wilfrido Massieu', tipo: 'IPN', puntaje: 80 },
    { id: 'cecyt12', nombre: 'CECyT 12 José María Morelos', tipo: 'IPN', puntaje: 83 },
    { id: 'cecyt13', nombre: 'CECyT 13 Ricardo Flores Magón', tipo: 'IPN', puntaje: 91 },
    { id: 'cecyt14', nombre: 'CECyT 14 Luis Enrique Erro', tipo: 'IPN', puntaje: 82 },
    { id: 'cecyt15', nombre: 'CECyT 15 Diódoro Antúnez', tipo: 'IPN', puntaje: 87 },
    { id: 'cecyt16', nombre: 'CECyT 16 Hidalgo', tipo: 'IPN', puntaje: 0 }, // For reference
];
