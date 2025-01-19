import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanillaQuincenal } from './planilla-quincenal.entity';
import { PlanillaEmpleado } from '../planilla-empleado/planilla-empleado.entity';
import { RazonSocial } from '../razon-social/razon-social.entity';

@Injectable()
export class PlanillaQuincenalService {
    constructor(
        @InjectRepository(PlanillaQuincenal)
        private readonly planillaQuincenalRepository: Repository<PlanillaQuincenal>,
        @InjectRepository(PlanillaEmpleado)
        private readonly planillaEmpleadoRepository: Repository<PlanillaEmpleado>,
        @InjectRepository(RazonSocial)
        private readonly razonSocialRepository: Repository<RazonSocial>,
      ) {}

  async crear(data: Partial<PlanillaQuincenal>): Promise<PlanillaQuincenal> {
    const { razonSocial, detalles, ...planillaData } = data;
  
    // Validar que la razón social existe
    const razonSocialEntity = await this.razonSocialRepository.findOne({
      where: { id: razonSocial.id },
      relations: ['panaderias', 'panaderias.empleados'],
    });
    if (!razonSocialEntity) {
      throw new NotFoundException(`Razón Social con ID ${razonSocial.id} no encontrada`);
    }
  
    // Crear la planilla
    const planilla = this.planillaQuincenalRepository.create(planillaData);
    planilla.razonSocial = razonSocialEntity;
  
    if (detalles && detalles.length > 0) {
      // Ordenar empleados por panadería y alfabéticamente
      const empleadosOrdenados = detalles.sort((a, b) => {
        if (a.panaderia.nombre === b.panaderia.nombre) {
          return a.nombreEmpleado.localeCompare(b.nombreEmpleado);
        }
        return a.panaderia.nombre.localeCompare(b.panaderia.nombre);
      });
  
      // Crear y guardar los detalles
      const detalleEntities = empleadosOrdenados.map((detalle) =>
        this.planillaEmpleadoRepository.create(detalle),
      );
      planilla.detalles = await this.planillaEmpleadoRepository.save(detalleEntities);
  
      // Calcular los totales
      planilla.totalesSalarioNormal = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.salarioNormal,
        0,
      );
      planilla.totalesSalarioExtras = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.salarioExtras,
        0,
      );
      planilla.totalesSalarioBruto = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.salarioTotalBruto,
        0,
      );
      planilla.totalesCCSS = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.ccss,
        0,
      );
      planilla.totalesBPDC = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.bpdc,
        0,
      );
      planilla.totalesEmbargos = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.embargos,
        0,
      );
      planilla.totalesAdelantos = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.adelantos,
        0,
      );
      planilla.totalesSalarioNeto = planilla.detalles.reduce(
        (acc, detalle) => acc + detalle.salarioNeto,
        0,
      );
    }
  
    // Guardar la planilla con los totales calculados
    return this.planillaQuincenalRepository.save(planilla);
  }
  
  

  async obtenerTodas(): Promise<PlanillaQuincenal[]> {
    return this.planillaQuincenalRepository.find({
      relations: ['razonSocial', 'detalles', 'detalles.panaderia'],
    });
  }
  

  async obtenerPorId(id: number): Promise<PlanillaQuincenal> {
    const planilla = await this.planillaQuincenalRepository.findOne({
      where: { id },
      relations: ['detalles'],
    });
    if (!planilla) {
      throw new NotFoundException(`Planilla con ID ${id} no encontrada`);
    }
    return planilla;
  }

  async actualizar(id: number, data: Partial<PlanillaQuincenal>): Promise<PlanillaQuincenal> {
    const planilla = await this.obtenerPorId(id);
    Object.assign(planilla, data);
    return this.planillaQuincenalRepository.save(planilla);
  }

  async eliminar(id: number): Promise<void> {
    const planilla = await this.obtenerPorId(id);
    await this.planillaQuincenalRepository.remove(planilla);
  }
}
