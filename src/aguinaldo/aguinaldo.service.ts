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
    const currentYear = anio || new Date().getFullYear();
    return this.aguinaldoRepository.findOne({
      where: {
        cedulaEmpleado,
        anio: currentYear,
      },
    });
  }

  async findByPanaderia(panaderia: string, anio?: number): Promise<Aguinaldo[]> {
    const currentYear = anio || new Date().getFullYear();
    return this.aguinaldoRepository.find({
      where: {
        panaderia,
        anio: currentYear,
      },
      order: {
        nombreCompleto: 'ASC',
      },
    });
  }

  async registrarSalarioBruto(datos: {
    nombreCompleto: string;
    cedulaEmpleado: string;
    razonSocial: string;
    panaderia: string;
    salarioTotalBruto: number;
    anio?: number;
  }): Promise<Aguinaldo> {
    const currentYear = datos.anio || new Date().getFullYear();
    
    // Buscar si ya existe un registro para este empleado en el año actual
    let aguinaldoExistente = await this.findByEmpleado(datos.cedulaEmpleado, currentYear);

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
        anio: currentYear,
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
    const currentYear = anio || new Date().getFullYear();
    const aguinaldos = await this.aguinaldoRepository.find({
      where: { anio: currentYear },
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
    const currentYear = anio || new Date().getFullYear();
    const aguinaldos = await this.findByPanaderia(panaderia, currentYear);
    
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
}
