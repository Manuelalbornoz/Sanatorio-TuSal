import { Body, Controller, Post } from "@nestjs/common";
import { PacienteUseCase } from "../../application/use-cases/paciente.usecase";
import { PacienteDTO } from "../../application/dto/crear-paciente.dto";

@Controller('pacientes')
export class PacienteController {
    constructor(private readonly createPacienteService: PacienteUseCase) {}

    @Post()
    async createPaciente(@Body() crearCategoriaDTO: PacienteDTO) {
        return await this.createPacienteService.createPaciente(crearCategoriaDTO);
    }
}