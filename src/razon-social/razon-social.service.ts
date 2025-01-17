import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RazonSocial } from './razon-social.entity';

@Injectable()
export class RazonSocialService {
  constructor(
    @InjectRepository(RazonSocial)
    private readonly razonSocialRepository: Repository<RazonSocial>,
  ) {}

  async crear(data: Partial<RazonSocial>): Promise<RazonSocial> {
    const razonSocial = this.razonSocialRepository.create(data);
    return this.razonSocialRepository.save(razonSocial);
  }

  async obtenerTodas(): Promise<RazonSocial[]> {
    return this.razonSocialRepository.find();
  }

  async obtenerPorId(id: number): Promise<RazonSocial> {
    const razonSocial = await this.razonSocialRepository.findOneBy({ id });
    if (!razonSocial) {
      throw new NotFoundException(`Razón social con ID ${id} no encontrada`);
    }
    return razonSocial;
  }

  async actualizar(id: number, data: Partial<RazonSocial>): Promise<RazonSocial> {
    const razonSocial = await this.obtenerPorId(id);
    Object.assign(razonSocial, data);
    return this.razonSocialRepository.save(razonSocial);
  }

  async eliminar(id: number): Promise<void> {
    const razonSocial = await this.obtenerPorId(id);
    await this.razonSocialRepository.remove(razonSocial);
  }
}
