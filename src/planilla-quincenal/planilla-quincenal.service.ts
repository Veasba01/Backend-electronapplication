import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanillaQuincenal } from './planilla-quincenal.entity';
import { PlanillaEmpleado } from '../planilla-empleado/planilla-empleado.entity';
import { RazonSocial } from '../razon-social/razon-social.entity';
import { AguinaldoService } from '../aguinaldo/aguinaldo.service';

@Injectable()
export class PlanillaQuincenalService {
    constructor(
        @InjectRepository(PlanillaQuincenal)
        private readonly planillaQuincenalRepository: Repository<PlanillaQuincenal>,
        @InjectRepository(PlanillaEmpleado)
        private readonly planillaEmpleadoRepository: Repository<PlanillaEmpleado>,
        @InjectRepository(RazonSocial)
        private readonly razonSocialRepository: Repository<RazonSocial>,
        private readonly aguinaldoService: AguinaldoService,
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
      });      // Crear y guardar los detalles
      const detalleEntities = empleadosOrdenados.map((detalle) =>
        this.planillaEmpleadoRepository.create(detalle),
      );
      planilla.detalles = await this.planillaEmpleadoRepository.save(detalleEntities);      // Registrar automáticamente en aguinaldo para cada empleado
      for (const detalle of planilla.detalles) {
        try {
          const nombreCompleto = `${detalle.nombreEmpleado} ${detalle.primerApellidoEmpleado} ${detalle.segundoApellidoEmpleado}`;
          
          console.log(`Registrando en aguinaldo - Empleado: ${detalle.cedulaEmpleado}, Fecha planilla: ${planilla.fechaInicio}, Tipo: ${typeof planilla.fechaInicio}`);
          
          await this.aguinaldoService.registrarSalarioBruto({
            nombreCompleto: nombreCompleto.trim(),
            cedulaEmpleado: detalle.cedulaEmpleado,
            razonSocial: razonSocialEntity.nombre,
            panaderia: detalle.panaderia?.nombre || 'No especificada',
            salarioTotalBruto: detalle.salarioTotalBruto,
            fechaPlanilla: planilla.fechaInicio, // Usar la fecha de inicio de la planilla
          });
        } catch (error) {
          console.error(`Error al registrar salario en aguinaldo para empleado ${detalle.cedulaEmpleado}:`, error);
          // No falla la creación de la planilla si hay error en aguinaldo
        }
      }
  
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
    return await this.planillaQuincenalRepository.findOne({
      where: { id },
      relations: ['razonSocial', 'detalles', 'detalles.panaderia'], // Asegura que se incluya la razón social y panaderías
    });
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
