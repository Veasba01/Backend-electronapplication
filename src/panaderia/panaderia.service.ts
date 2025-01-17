import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Panaderia } from './panaderia.entity';

@Injectable()
export class PanaderiaService {
  constructor(
    @InjectRepository(Panaderia)
    private readonly panaderiaRepository: Repository<Panaderia>,
  ) {}

  async crear(data: Partial<Panaderia>): Promise<Panaderia> {
    const panaderia = this.panaderiaRepository.create(data);
    return this.panaderiaRepository.save(panaderia);
  }

  async obtenerTodas(): Promise<Panaderia[]> {
    return this.panaderiaRepository.find({
      relations: ['razonSocial'], // Incluye relaciones, si es necesario
    });
  }

  async obtenerPorId(id: number): Promise<Panaderia> {
    const panaderia = await this.panaderiaRepository.findOne({
      where: { id },
      relations: ['razonSocial'], // Incluye relaciones, si es necesario
    });
    if (!panaderia) {
      throw new NotFoundException(`Panadería con ID ${id} no encontrada`);
    }
    return panaderia;
  }

  async actualizar(id: number, data: Partial<Panaderia>): Promise<Panaderia> {
    const panaderia = await this.obtenerPorId(id);
    Object.assign(panaderia, data);
    return this.panaderiaRepository.save(panaderia);
  }

  async eliminar(id: number): Promise<void> {
    const panaderia = await this.obtenerPorId(id);
    await this.panaderiaRepository.remove(panaderia);
  }
}
