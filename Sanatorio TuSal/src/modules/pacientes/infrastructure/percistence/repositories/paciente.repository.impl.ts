import { InjectRepository } from "@nestjs/typeorm";
import { IPacienteRepository } from "src/modules/pacientes/domain/repositories/paciente.repository";
import { Repository } from "typeorm";
import { PacienteOrm } from "../orm-entities/paciente.orm";

export class PacienteRepositoryImpl  implements IPacienteRepository {
    constructor(
        
        @InjectRepository(PacienteOrm)
        private readonly pacienteRepositoryImpl: Repository<PacienteOrm>
    ) {}
    
    async createPaciente(paciente: any): Promise<any> {
        const pacienteEntity = this.pacienteRepositoryImpl.create(paciente);
        return await this.pacienteRepositoryImpl.save(pacienteEntity);
    }
}
