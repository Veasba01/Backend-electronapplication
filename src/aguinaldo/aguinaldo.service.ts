import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aguinaldo } from './aguinaldo.entity';

@Injectable()
export class AguinaldoService {
  constructor(
    @InjectRepository(Aguinaldo)
    private aguinaldoRepository: Repository<Aguinaldo>,
  ) {}

  async findAll(): Promise<Aguinaldo[]> {
    return this.aguinaldoRepository.find({
      order: {
        fechaActualizacion: 'DESC',
      },
    });
  }
  async findByEmpleado(cedulaEmpleado: string, anio?: number): Promise<Aguinaldo> {
    const aguinaldoYear = anio || this.getAguinaldoYear();
    return this.aguinaldoRepository.findOne({
      where: {
        cedulaEmpleado,
        anio: aguinaldoYear,
      },
    });
  }

  async findByPanaderia(panaderia: string, anio?: number): Promise<Aguinaldo[]> {
    const aguinaldoYear = anio || this.getAguinaldoYear();
    return this.aguinaldoRepository.find({
      where: {
        panaderia,
        anio: aguinaldoYear,
      },
      order: {
        nombreCompleto: 'ASC',
      },
    });
  }  async registrarSalarioBruto(datos: {
    nombreCompleto: string;
    cedulaEmpleado: string;
    razonSocial: string;
    panaderia: string;
    salarioTotalBruto: number;
    anio?: number;
    fechaPlanilla?: Date | string;
  }): Promise<Aguinaldo> {
    // Si se proporciona una fecha específica, calcular el año de aguinaldo basado en esa fecha
    // Si no, usar el año proporcionado o el año actual de aguinaldo
    const aguinaldoYear = datos.fechaPlanilla 
      ? this.getAguinaldoYear(datos.fechaPlanilla)
      : (datos.anio || this.getAguinaldoYear());
    
    // Buscar si ya existe un registro para este empleado en el año de aguinaldo
    let aguinaldoExistente = await this.findByEmpleado(datos.cedulaEmpleado, aguinaldoYear);

    if (aguinaldoExistente) {
      // Actualizar el acumulado
      aguinaldoExistente.acumuladoSalariosBrutos += Number(datos.salarioTotalBruto);
      aguinaldoExistente.aguinaldoCalculado = this.calcularAguinaldo(aguinaldoExistente.acumuladoSalariosBrutos);
      aguinaldoExistente.fechaActualizacion = new Date();
      
      return this.aguinaldoRepository.save(aguinaldoExistente);
    } else {
      // Crear nuevo registro
      const nuevoAguinaldo = this.aguinaldoRepository.create({
        nombreCompleto: datos.nombreCompleto,
        cedulaEmpleado: datos.cedulaEmpleado,
        razonSocial: datos.razonSocial,
        panaderia: datos.panaderia,
        acumuladoSalariosBrutos: Number(datos.salarioTotalBruto),
        aguinaldoCalculado: this.calcularAguinaldo(Number(datos.salarioTotalBruto)),
        anio: aguinaldoYear,
      });

      return this.aguinaldoRepository.save(nuevoAguinaldo);
    }
  }

  private calcularAguinaldo(acumuladoSalarios: number): number {
    // El aguinaldo en Costa Rica equivale a 1/12 del salario anual
    // Si no ha trabajado el año completo, se calcula proporcionalmente
    return acumuladoSalarios / 12;
  }
  async recalcularAguinaldos(anio?: number): Promise<Aguinaldo[]> {
    const aguinaldoYear = anio || this.getAguinaldoYear();
    const aguinaldos = await this.aguinaldoRepository.find({
      where: { anio: aguinaldoYear },
    });

    const aguinaldosActualizados = aguinaldos.map(aguinaldo => {
      aguinaldo.aguinaldoCalculado = this.calcularAguinaldo(aguinaldo.acumuladoSalariosBrutos);
      return aguinaldo;
    });

    return this.aguinaldoRepository.save(aguinaldosActualizados);
  }

  async findByAnio(anio: number): Promise<Aguinaldo[]> {
    return this.aguinaldoRepository.find({
      where: { anio },
      order: {
        panaderia: 'ASC',
        nombreCompleto: 'ASC',
      },
    });
  }
  async getTotalAguinaldosByPanaderia(panaderia: string, anio?: number): Promise<{ total: number; empleados: number }> {
    const aguinaldoYear = anio || this.getAguinaldoYear();
    const aguinaldos = await this.findByPanaderia(panaderia, aguinaldoYear);
    
    const total = aguinaldos.reduce((sum, aguinaldo) => sum + Number(aguinaldo.aguinaldoCalculado), 0);
    
    return {
      total,
      empleados: aguinaldos.length,
    };
  }

  async delete(id: number): Promise<void> {
    await this.aguinaldoRepository.delete(id);
  }

  async resetAguinaldos(anio: number): Promise<void> {
    await this.aguinaldoRepository.delete({ anio });
  }
  /**
   * Calcula el año del aguinaldo basado en el período diciembre-noviembre
   * Ejemplo: 
   * - Enero 2025 -> Año aguinaldo 2025 (período dic 2024 - nov 2025)
   * - Diciembre 2024 -> Año aguinaldo 2025 (período dic 2024 - nov 2025)
   */
  private getAguinaldoYear(fecha?: Date | string): number {
    let currentDate: Date;
    
    if (fecha) {
      // Si es string, convertir a Date
      currentDate = typeof fecha === 'string' ? new Date(fecha) : fecha;
    } else {
      currentDate = new Date();
    }
    
    // Validar que sea un Date válido
    if (isNaN(currentDate.getTime())) {
      console.error('Fecha inválida recibida en getAguinaldoYear:', fecha);
      currentDate = new Date(); // Usar fecha actual como fallback
    }
    
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const year = currentDate.getFullYear();
    
    // Si estamos en diciembre, el aguinaldo corresponde al año siguiente
    // Si estamos en enero-noviembre, el aguinaldo corresponde al año actual
    return month === 12 ? year + 1 : year;
  }
  /**
   * Verifica si una fecha está dentro del período de aguinaldo para un año específico
   * @param fecha Fecha a verificar
   * @param aguinaldoYear Año del aguinaldo
   * @returns true si la fecha está en el período diciembre-noviembre del año de aguinaldo
   */
  private isInAguinaldoPeriod(fecha: Date | string, aguinaldoYear: number): boolean {
    let dateToCheck: Date;
    
    if (typeof fecha === 'string') {
      dateToCheck = new Date(fecha);
    } else {
      dateToCheck = fecha;
    }
    
    // Validar que sea un Date válido
    if (isNaN(dateToCheck.getTime())) {
      console.error('Fecha inválida recibida en isInAguinaldoPeriod:', fecha);
      return false;
    }
    
    // Período de diciembre del año anterior a noviembre del año del aguinaldo
    const periodoInicio = new Date(aguinaldoYear - 1, 11, 1); // 1 diciembre año anterior
    const periodoFin = new Date(aguinaldoYear, 10, 30); // 30 noviembre año aguinaldo
    
    return dateToCheck >= periodoInicio && dateToCheck <= periodoFin;
  }

  async getAguinaldoYearActual(): Promise<{ anio: number; periodo: string }> {
    const anio = this.getAguinaldoYear();
    const periodo = `Diciembre ${anio - 1} - Noviembre ${anio}`;
    return { anio, periodo };
  }
}
