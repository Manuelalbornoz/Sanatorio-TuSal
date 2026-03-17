
export class PacienteDominio {
    constructor(
    public id: number | null,
    public nombre: string,
    public apellido: string,
    public documento: string,
    public fechaNacimiento: Date,
    public genero: string,
    public grupoSanguineo: string,
    public telefono: string,
    public email: string,
    public direccion: string,
) { }

static crearPaciente(props: {id: number | null, nombre: string; apellido: string; documento: string; fechaNacimiento: Date; genero: string;
    grupoSanguineo: string; telefono: string; email: string; direccion: string;}): PacienteDominio {
    return new PacienteDominio(null,props.nombre, props.apellido, props.documento, props.fechaNacimiento, props.genero,
        props.grupoSanguineo, props.telefono, props.email, props.direccion);
    }

actualizarId(id: number) {
    this.id = id;
}
actualizarNombre(nombre: string) {
    this.nombre = nombre;
}
actualizarApellido(apellido: string) {
    this.apellido = apellido;
}
actualizarDocumento(documento: string) {
    this.documento = documento;
}
actualizarFechaNacimiento(fechaNacimiento: Date) {
    this.fechaNacimiento = fechaNacimiento;
}
actualizarGenero(genero: string) {
    this.genero = genero;
}
actualizarGrupoSanguineo(grupoSanguineo: string) {
    this.grupoSanguineo = grupoSanguineo;
}
actualizarTelefono(telefono: string) {
    this.telefono = telefono;
}
actualizarEmail(email: string) {
    this.email = email;
}
actualizarDireccion(direccion: string) {
    this.direccion = direccion;
}
}