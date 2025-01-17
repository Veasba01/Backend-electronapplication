import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puesto } from './puesto.entity';

@Injectable()
export class PuestoService {
  constructor(
    @InjectRepository(Puesto)
    private readonly puestoRepository: Repository<Puesto>,
  ) {}

  async crear(data: Partial<Puesto>): Promise<Puesto> {
    const puesto = this.puestoRepository.create(data);
    return this.puestoRepository.save(puesto);
  }

  async obtenerTodos(): Promise<Puesto[]> {
    return this.puestoRepository.find();
  }

  async obtenerPorId(id: number): Promise<Puesto> {
    const puesto = await this.puestoRepository.findOne({ where: { id } });
    if (!puesto) {
      throw new NotFoundException(`Puesto con ID ${id} no encontrado`);
    }
    return puesto;
  }

  async actualizar(id: number, data: Partial<Puesto>): Promise<Puesto> {
    const puesto = await this.obtenerPorId(id);
    Object.assign(puesto, data);
    return this.puestoRepository.save(puesto);
  }

  async eliminar(id: number): Promise<void> {
    const puesto = await this.obtenerPorId(id);
    await this.puestoRepository.remove(puesto);
  }
}
