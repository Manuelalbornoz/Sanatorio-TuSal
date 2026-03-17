import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("paciente")
export class PacienteOrm {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    apellido: string;
    @Column()
    documento: string;
    @Column()
    fechaNacimiento: Date;
    @Column()
    genero: string;
    @Column()
    grupoSanguineo: string;
    @Column()
    telefono: string;
    @Column()
    email: string;
    @Column()
    direccion: string;
    @Column()
    fechaCreacion: Date;
}