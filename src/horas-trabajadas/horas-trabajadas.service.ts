import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorasTrabajadas } from './horas-trabajadas.entity';

@Injectable()
export class HorasTrabajadasService {
  constructor(
    @InjectRepository(HorasTrabajadas)
    private readonly horasTrabajadasRepository: Repository<HorasTrabajadas>,
  ) {}

  async crear(data: Partial<HorasTrabajadas>): Promise<HorasTrabajadas> {
    const horasTrabajadas = this.horasTrabajadasRepository.create(data);
    return this.horasTrabajadasRepository.save(horasTrabajadas);
  }

  async obtenerTodas(): Promise<HorasTrabajadas[]> {
    return this.horasTrabajadasRepository.find({
      relations: ['empleado'], // Incluye relaciones, si es necesario
    });
  }

  async obtenerPorId(id: number): Promise<HorasTrabajadas> {
    const horas = await this.horasTrabajadasRepository.findOne({
      where: { id },
      relations: ['empleado'], // Incluye relaciones, si es necesario
    });
    if (!horas) {
      throw new NotFoundException(`Horas trabajadas con ID ${id} no encontradas`);
    }
    return horas;
  }

  async actualizar(id: number, data: Partial<HorasTrabajadas>): Promise<HorasTrabajadas> {
    const horas = await this.obtenerPorId(id);
    Object.assign(horas, data);
    return this.horasTrabajadasRepository.save(horas);
  }

  async eliminar(id: number): Promise<void> {
    const horas = await this.obtenerPorId(id);
    await this.horasTrabajadasRepository.remove(horas);
  }
}
