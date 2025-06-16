import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanillaEmpleado } from './planilla-empleado.entity';
import { AguinaldoService } from '../aguinaldo/aguinaldo.service';

@Injectable()
export class PlanillaEmpleadoService {
  constructor(
    @InjectRepository(PlanillaEmpleado)
    private readonly planillaEmpleadoRepository: Repository<PlanillaEmpleado>,
    private readonly aguinaldoService: AguinaldoService,
  ) {}
  async crear(data: Partial<PlanillaEmpleado>): Promise<PlanillaEmpleado> {
    const detalle = this.planillaEmpleadoRepository.create(data);
    const planillaGuardada = await this.planillaEmpleadoRepository.save(detalle);
    
    // Registrar automáticamente en aguinaldo
    if (planillaGuardada.salarioTotalBruto) {
      try {
        const nombreCompleto = `${planillaGuardada.nombreEmpleado} ${planillaGuardada.primerApellidoEmpleado} ${planillaGuardada.segundoApellidoEmpleado}`;
          // Obtener información de relaciones si están disponibles
        const planillaConRelaciones = await this.planillaEmpleadoRepository.findOne({
          where: { id: planillaGuardada.id },
          relations: ['planilla', 'planilla.razonSocial', 'panaderia'],
        });

        await this.aguinaldoService.registrarSalarioBruto({
          nombreCompleto: nombreCompleto.trim(),
          cedulaEmpleado: planillaGuardada.cedulaEmpleado,
          razonSocial: planillaConRelaciones?.planilla?.razonSocial?.nombre || 'No especificada',
          panaderia: planillaConRelaciones?.panaderia?.nombre || 'No especificada',
          salarioTotalBruto: planillaGuardada.salarioTotalBruto,
        });
      } catch (error) {
        console.error('Error al registrar salario en aguinaldo:', error);
        // No falla la creación de la planilla si hay error en aguinaldo
      }
    }
    
    return planillaGuardada;
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
