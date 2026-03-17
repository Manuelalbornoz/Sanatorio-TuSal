import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteOrm } from './infrastructure/percistence/orm-entities/paciente.orm';
import { PacienteController } from './presentation/controllers/paciente.controller';
import { PacienteUseCase } from './application/use-cases/paciente.usecase';
import { PacienteRepositoryImpl } from './infrastructure/percistence/repositories/paciente.repository.impl';

@Module({
    imports: [TypeOrmModule.forFeature([PacienteOrm])],
    controllers: [PacienteController],
    providers: [
        PacienteUseCase,
        {
            provide: 'IPacienteRepository',
            useClass: PacienteRepositoryImpl,
        }
    ],
    exports: [PacienteUseCase],
})
export class PacientesModule { }
