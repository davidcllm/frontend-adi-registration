import { Role } from "./role";
import { Total } from "./total"

export interface User {
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    carrera: string,
    role: Role,
    token: string,
    total: Total
}