export interface User {
  id: string;
  name: string;
  username: string;
  createdAt: string;
}

export interface Cep {
  id: string;
  cep: string;
  logradouro: string;
  complemento?: string;
  unidade?: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia?: string;
  ddd: string;
  siafi: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  username: string;
  password: string;
}

export interface CreateCepDto {
  cep: string;
  logradouro: string;
  complemento?: string;
  unidade?: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia?: string;
  ddd: string;
  siafi: string;
}

export interface UpdateCepDto extends Partial<CreateCepDto> {}
