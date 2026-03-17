import { PacienteDTO } from "../../application/dto/crear-paciente.dto";
import { PacienteDominio } from "../entities/paciente.entity";

export interface IPacienteRepository {
    createPaciente(paciente: PacienteDTO): Promise<PacienteDominio>;
}