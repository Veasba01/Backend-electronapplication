import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Empleado } from './empleado.entity';
import { Panaderia } from '../panaderia/panaderia.entity';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Panaderia)
    private readonly panaderiaRepository: Repository<Panaderia>,
  ) {}

  async crear(data: Partial<Empleado>): Promise<Empleado> {
    const empleado = this.empleadoRepository.create(data);
    return this.empleadoRepository.save(empleado);
  }

  async obtenerTodos(): Promise<Empleado[]> {
    return this.empleadoRepository.find({
      relations: ['panaderia', 'puesto'], // Incluye relaciones necesarias
    });
  }

  async obtenerPorId(id: number): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id },
      relations: ['panaderia', 'puesto'], // Incluye relaciones necesarias
    });
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return empleado;
  }

  async actualizar(id: number, data: Partial<Empleado>): Promise<Empleado> {
    const empleado = await this.obtenerPorId(id);
    Object.assign(empleado, data);
    return this.empleadoRepository.save(empleado);
  }

  async eliminar(id: number): Promise<void> {
    const empleado = await this.obtenerPorId(id);
    await this.empleadoRepository.remove(empleado);
  }

  async obtenerPorRazonSocial(razonSocialId: number): Promise<Empleado[]> {
    return await this.empleadoRepository
      .createQueryBuilder('empleado')
      .leftJoinAndSelect('empleado.panaderia', 'panaderia')
      .leftJoinAndSelect('panaderia.razonSocial', 'razon_social') // Nombre correcto de la tabla
      .leftJoinAndSelect('empleado.puesto', 'puesto')
      .where('razon_social.id = :razonSocialId', { razonSocialId })
      .getMany();
  }
  
}
