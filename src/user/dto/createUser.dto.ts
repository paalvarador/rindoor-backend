import { Role } from "../entities/Role.enum";

export class CreateUserDto {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  address: string;

  role: Role.CLIENT | Role.ADMIN;
}
