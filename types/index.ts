// Person type definition
export type PersonType = {
  id: number;
  cedula: string;
  nombre: string;
  apellidos: string;
  nacionalidad: string;
  alias?: string;
  genero?: string;
  fechaNacimiento?: string;
  foto?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
};

// Vehicle type definition
export type VehicleType = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anno: string;
  tipo?: string;
  foto?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
};

// Property type definition
export type PropertyType = {
  id: number;
  tipo: string;
  descripcion: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  foto?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
};

// Location type definition
export type LocationType = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  latitud: number;
  longitud: number;
  foto?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
};

// User type definition
export type UserType = {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

// Authentication response type
export type AuthResponseType = {
  token: string;
  user: UserType;
};