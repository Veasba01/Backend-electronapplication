import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../empleado/empleado.entity';
import { EmpleadoDespedido } from './empleado-despedido.entity';

@Injectable()
export class EmpleadoDespedidoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(EmpleadoDespedido)
    private readonly empleadoDespedidoRepository: Repository<EmpleadoDespedido>,
  ) {}

  async despedirEmpleado(id: number, data: { razonDespido: string; panaderia: string }): Promise<void> {
    // Obtener la información del empleado
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: ['panaderia'], // Incluye la relación de la panadería
    });

    if (!empleado) {
      throw new Error(`Empleado con ID ${id} no encontrado`);
    }

    // Crear un registro en la tabla EmpleadoDespedido
    const empleadoDespedido = this.empleadoDespedidoRepository.create({
      nombre: empleado.nombre,
      primerApellido: empleado.primerApellido,
      segundoApellido: empleado.segundoApellido,
      cedula: empleado.cedula,
      razonDespido: data.razonDespido,
      panaderia: data.panaderia || empleado.panaderia?.nombre || 'Desconocida', // Incluye el nombre de la panadería
      fechaDespido: new Date(),
    });

    await this.empleadoDespedidoRepository.save(empleadoDespedido);

    // Eliminar el empleado de la tabla Empleado
    await this.empleadoRepository.remove(empleado);
  }

  async obtenerTodos(): Promise<EmpleadoDespedido[]> {
    return this.empleadoDespedidoRepository.find();
  }
}
