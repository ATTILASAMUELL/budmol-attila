import { Role } from '../enums/Role';
import { User } from '../models/User';

export function isAdmin(user: User | null): boolean {
  return user?.role === Role.ADMINISTRADOR;
}

export function isParticipant(user: User | null): boolean {
  return user?.role === Role.PARTICIPANTE;
}
