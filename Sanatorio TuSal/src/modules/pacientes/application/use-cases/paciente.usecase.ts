import { Injectable, Inject } from "@nestjs/common";
import { PacienteDTO } from "../dto/crear-paciente.dto";
import type { IPacienteRepository } from "../../domain/repositories/paciente.repository";


@Injectable()
export class PacienteUseCase {
    constructor(
        @Inject('IPacienteRepository')
        private readonly pacienteRepository: IPacienteRepository,
    ) {}

    async createPaciente(pacienteDTO: PacienteDTO) {
        return await this.pacienteRepository.createPaciente(pacienteDTO);
    }
}