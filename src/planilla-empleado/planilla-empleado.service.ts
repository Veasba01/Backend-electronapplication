import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanillaEmpleado } from './planilla-empleado.entity';

@Injectable()
export class PlanillaEmpleadoService {
  constructor(
    @InjectRepository(PlanillaEmpleado)
    private readonly planillaEmpleadoRepository: Repository<PlanillaEmpleado>,
  ) {}

  async crear(data: Partial<PlanillaEmpleado>): Promise<PlanillaEmpleado> {
    const detalle = this.planillaEmpleadoRepository.create(data);
    return this.planillaEmpleadoRepository.save(detalle);
  }

  async obtenerTodos(): Promise<PlanillaEmpleado[]> {
    return this.planillaEmpleadoRepository.find({
      relations: ['planilla', 'panaderia'],
    });
  }

  async obtenerPorId(id: number): Promise<PlanillaEmpleado> {
    const detalle = await this.planillaEmpleadoRepository.findOne({
      where: { id },
      relations: ['planilla', 'panaderia'],
    });
    if (!detalle) {
      throw new NotFoundException(`Detalle de empleado con ID ${id} no encontrado`);
    }
    return detalle;
  }

  async actualizar(id: number, data: Partial<PlanillaEmpleado>): Promise<PlanillaEmpleado> {
    const detalle = await this.obtenerPorId(id);
    Object.assign(detalle, data);
    return this.planillaEmpleadoRepository.save(detalle);
  }

  async eliminar(id: number): Promise<void> {
    const detalle = await this.obtenerPorId(id);
    await this.planillaEmpleadoRepository.remove(detalle);
  }
}
