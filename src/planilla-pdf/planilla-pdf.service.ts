import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { PlanillaQuincenalService } from '../planilla-quincenal/planilla-quincenal.service';
import { Response } from 'express';

@Injectable()
export class PlanillaPdfService {
  constructor(private readonly planillaService: PlanillaQuincenalService) {}

  async generatePlanillaPDF(planillaId: number, res: Response) {
    const planilla = await this.planillaService.obtenerPorId(planillaId);
    if (!planilla) {
        throw new Error('Planilla no encontrada');
    }

    // 📌 Crear documento en MODO HORIZONTAL
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 20 });

    // 📌 Configurar la respuesta HTTP para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Planilla_${planillaId}.pdf`);

    doc.pipe(res);

    // 📌 Título del documento
    doc.fontSize(16).text(planilla.razonSocial.nombre, { align: 'center' });
    doc.fontSize(14).text('PLANILLA QUINCENAL', { align: 'center' });
    doc.fontSize(12).text(`Del ${planilla.fechaInicio} al ${planilla.fechaFinal}`, { align: 'center' });
    doc.moveDown(2);

    // 📌 Encabezados de la tabla
    const tableHeaders = [
        'Empleado', 'S/Mes', 'S/Hora', 'H/S', 'H/E',
        'S/Normal', 'S/Extras', 'Otros/Ing', 'S/Bruto', 
        'CCSS', 'BPDC', 'Emba', 'Adel', 'S/Neto'
    ];

    // 📌 Ordenar empleados por panadería y primer apellido
    const empleadosOrdenados = planilla.detalles.sort((a, b) => 
        a.panaderia.nombre.localeCompare(b.panaderia.nombre) ||
        a.primerApellidoEmpleado.localeCompare(b.primerApellidoEmpleado)
    );

    let startX = 20;
    let startY = doc.y + 10;
    const columnWidths = [60, 60, 60, 20, 20, 60, 60, 60, 60, 60, 50, 60, 60, 60];
    const rowHeight = 35;
    let panaderiaActual = '';

    // 📌 Dibujar encabezados de la tabla
    doc.font('Helvetica-Bold').fontSize(10);
    tableHeaders.forEach((header, index) => {
        doc.text(header, startX, startY, { width: columnWidths[index], align: 'center' });
        startX += columnWidths[index];
    });

    startY += rowHeight;
    startX = 20;

    // 📌 Dibujar filas de empleados
    doc.font('Helvetica').fontSize(9);
    empleadosOrdenados.forEach((detalle, index) => {
        // 📌 Insertar fila de panadería si cambia
        if (detalle.panaderia.nombre !== panaderiaActual) {
            if (index !== 0) {
                startY += 10; // Espacio adicional entre panaderías
            }

            doc.font('Helvetica-Bold').fontSize(10).text(detalle.panaderia.nombre.toUpperCase(), startX, startY, {
                width: 800, align: 'center'
            });

            panaderiaActual = detalle.panaderia.nombre;
            startY += rowHeight;
        }

        // 📌 Verificar si hay suficiente espacio en la página
        if (startY + rowHeight > doc.page.height - 50) {
            doc.addPage({ size: 'A4', layout: 'landscape', margin: 20 });
            startY = 50;
            startX = 20;

            // 📌 Volver a dibujar los encabezados en la nueva página
            doc.font('Helvetica-Bold').fontSize(10);
            tableHeaders.forEach((header, index) => {
                doc.text(header, startX, startY, { width: columnWidths[index], align: 'center' });
                startX += columnWidths[index];
            });

            startY += rowHeight;
            startX = 20;
        }

        // 📌 Dibujar fila del empleado
        doc.font('Helvetica').fontSize(9);
        const row = [
            `${detalle.primerApellidoEmpleado} ${detalle.segundoApellidoEmpleado} \n${detalle.nombreEmpleado}`,
            detalle.salarioMes.toLocaleString(),
            detalle.salarioHora.toLocaleString(),
            detalle.horasSencillas.toString(),
            detalle.horasExtras.toString(),
            detalle.salarioNormal.toLocaleString(),
            detalle.salarioExtras.toLocaleString(),
            detalle.otrosIngresos.toLocaleString(),
            detalle.salarioTotalBruto.toLocaleString(),
            detalle.ccss.toLocaleString(),
            detalle.bpdc.toLocaleString(),
            detalle.embargos.toLocaleString(),
            detalle.adelantos.toLocaleString(),
            detalle.salarioNeto.toLocaleString(),
        ];

        row.forEach((cell, index) => {
            doc.text(cell, startX, startY, { width: columnWidths[index], align: 'center' });
            startX += columnWidths[index];
        });

        startY += rowHeight;
        startX = 20;
    });

    // 📌 Agregar la fila de totales
    startY += 10; // Espacio antes de los totales
    const totalRow = [
        'TOTALES',
        '-',
        '-',
        '-',
        '-',
        planilla.totalesSalarioNormal.toLocaleString(),
        planilla.totalesSalarioExtras.toLocaleString(),
        '-',
        planilla.totalesSalarioBruto.toLocaleString(),
        planilla.totalesCCSS.toLocaleString(),
        planilla.totalesBPDC.toLocaleString(),
        planilla.totalesEmbargos.toLocaleString(),
        planilla.totalesAdelantos.toLocaleString(),
        planilla.totalesSalarioNeto.toLocaleString(),
    ];

    doc.font('Helvetica-Bold').fontSize(10);
    totalRow.forEach((cell, index) => {
        doc.text(cell, startX, startY, { width: columnWidths[index], align: 'center' });
        startX += columnWidths[index];
    });

    // 📌 Finalizar documento
    doc.end();
}


  async generateComprobantesPDF(planillaId: number, res: Response) {
    const planilla = await this.planillaService.obtenerPorId(planillaId);
    if (!planilla) {
      throw new Error('Planilla no encontrada');
    }
  
    // 📌 Crear documento PDF
    const doc = new PDFDocument({ size: 'A4', margin: 30 });
  
    // 📌 Configurar la respuesta HTTP para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Comprobantes_Pago_${planillaId}.pdf`);
  
    doc.pipe(res);
  
    planilla.detalles.forEach((empleado, index) => {
      // 📌 Control para dos comprobantes por hoja
      if (index % 2 === 0 && index > 0) {
        doc.addPage();
      }
  
      // 📌 Posición fija para el inicio de cada comprobante
      const comprobanteStartY = index % 2 === 0 ? 30 : 400;
      const leftMargin = 40;
      const pageWidth = 550;
  
      // 📌 Encabezado del comprobante
      doc.fontSize(9).text(`Comprobante: ${index + 1}`, leftMargin, comprobanteStartY);
      doc.fontSize(11).text('COMPROBANTES DE PAGO', { align: 'center', underline: true });
      doc.fontSize(9).text(planilla.razonSocial.nombre.toUpperCase(), pageWidth - 160, comprobanteStartY);
  
      doc.text(empleado.panaderia.nombre, leftMargin, doc.y + 5);
      doc.text(`Quincena del ${planilla.fechaInicio} AL ${planilla.fechaFinal}`, { align: 'center' });
  
      let startY = doc.y + 15;
  
      // 📌 Información del empleado (con más espacio entre tablas)
      this.drawTable(doc, [
        ['Nombre:', `${empleado.primerApellidoEmpleado} ${empleado.segundoApellidoEmpleado} ${empleado.nombreEmpleado}`, 'Cédula:', empleado.cedulaEmpleado],
        ['Salario Mensual:', empleado.salarioMes.toLocaleString(), '', '']
      ], [100, 200, 80, 100], startY);
  
      startY += 40;
  
      // 📌 Tabla de Horas Trabajadas (con más espacio)
      this.drawTable(doc, [
        ['Horas Trabajadas', 'Normales', 'Extras', 'Dobles'],
        ['Cantidad', empleado.horasSencillas, empleado.horasExtras, 0]
      ], [130, 70, 70, 70], startY);
  
      startY += 40;
  
      // 📌 Tabla de Salario Bruto
      this.drawTable(doc, [
        ['Salario Bruto', 'Normales', 'Extraordinario', 'Otros Ingresos', 'Total Bruto'],
        ['Monto', empleado.salarioNormal.toLocaleString(), empleado.salarioExtras.toLocaleString(), empleado.otrosIngresos.toLocaleString(), empleado.salarioTotalBruto.toLocaleString()]
      ], [110, 80, 80, 80, 100], startY);
  
      startY += 40;
  
      // 📌 Tabla de Deducciones
      this.drawTable(doc, [
        ['Deducciones', 'CCSS', 'Banco Pop.', 'Embargos', 'Adelantos', 'Total Deducciones'],
        ['Monto', empleado.ccss.toLocaleString(), empleado.bpdc.toLocaleString(), empleado.embargos.toLocaleString(), empleado.adelantos.toLocaleString(), (empleado.ccss + empleado.bpdc + empleado.embargos + empleado.adelantos).toLocaleString()]
      ], [90, 80, 80, 80, 80, 80], startY);
  
      startY += 40;
  
      // 📌 Tabla de Total a Pagar
      this.drawTable(doc, [['TOTAL A PAGAR', empleado.salarioNeto.toLocaleString()]], [280, 100], startY, true);
  
      startY += 50;
  
      // 📌 Línea separadora entre comprobantes
      doc.moveTo(leftMargin, startY).lineTo(pageWidth, startY).stroke();
    });
  
    // 📌 Finalizar documento
    doc.end();
  }
  
  /**
   * 📌 Función para dibujar tablas en el PDF con más espacio entre ellas.
   */
  private drawTable(doc: any, data: any[][], colWidths: number[], startY: number, boldLastRow = false) {
    let startX = 40;
    let rowHeight = 25; // Más espacio entre filas
  
    // 📌 Dibujar encabezados
    doc.font('Helvetica-Bold').fontSize(9);
    data[0].forEach((header, index) => {
      doc.text(header, startX, startY, { width: colWidths[index], align: 'center' });
      startX += colWidths[index];
    });
  
    startY += rowHeight;
    startX = 40;
  
    // 📌 Dibujar datos con más espacio entre tablas
    doc.font('Helvetica').fontSize(9);
    for (let i = 1; i < data.length; i++) {
      if (boldLastRow && i === data.length - 1) {
        doc.font('Helvetica-Bold');
      }
  
      data[i].forEach((cell, index) => {
        doc.text(cell.toString(), startX, startY, { width: colWidths[index], align: 'center' });
        startX += colWidths[index];
      });
  
      startY += rowHeight;
      startX = 40;
    }
  }  

  async generateResumenPDF(planillaId: number, res: Response) {
    const planilla = await this.planillaService.obtenerPorId(planillaId);
    if (!planilla) {
      throw new Error('Planilla no encontrada');
    }

    // 📌 Crear documento PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    // 📌 Configurar la respuesta HTTP para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Resumen_Planilla_${planillaId}.pdf`);

    doc.pipe(res);

    // 📌 Agrupar empleados por panadería
    const panaderias = new Map();
    planilla.detalles.forEach((empleado) => {
      if (!panaderias.has(empleado.panaderia.nombre)) {
        panaderias.set(empleado.panaderia.nombre, []);
      }
      panaderias.get(empleado.panaderia.nombre).push(empleado);
    });

    // 📌 Generar contenido para cada panadería
    panaderias.forEach((empleados, panaderia) => {
      doc.addPage();

      // 📌 Encabezado
      doc.fontSize(12).text(planilla.razonSocial.nombre, { align: 'center', underline: true });
      doc.fontSize(11).text(panaderia.nombre, { align: 'center' });
      doc.fontSize(10).text(`Planilla del ${planilla.fechaInicio} al ${planilla.fechaFinal}`, { align: 'center' });
      doc.moveDown(2);

      // 📌 Tabla de empleados
      const headers = ['Cédula', 'Nombre', 'Salario Neto'];
      const data = empleados.map((emp) => [
        emp.cedulaEmpleado,
        `${emp.primerApellidoEmpleado} ${emp.segundoApellidoEmpleado} ${emp.nombreEmpleado}`,
        emp.salarioNeto.toLocaleString()
      ]);

      // 📌 Agregar fila de total
      const totalSalarioNeto = empleados.reduce((sum, emp) => sum + emp.salarioNeto, 0);
      data.push(['', 'TOTAL:', totalSalarioNeto.toLocaleString()]);

      this.drawTable2(doc, headers, data, [120, 200, 100], doc.y);
    });

    // 📌 Finalizar documento
    doc.end();
  }

  /**
   * 📌 Función para dibujar tablas en el PDF.
   * @param doc - Documento PDF
   * @param headers - Encabezados de la tabla
   * @param data - Datos de la tabla
   * @param colWidths - Ancho de las columnas
   * @param startY - Posición inicial en el eje Y
   */
  private drawTable2(doc: any, headers: string[], data: any[][], colWidths: number[], startY: number) {
    let startX = 40;
    let rowHeight = 25;

    // 📌 Dibujar encabezados
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((header, index) => {
      doc.text(header, startX, startY, { width: colWidths[index], align: 'center' });
      startX += colWidths[index];
    });

    // 📌 Línea separadora
    doc.moveTo(40, startY + rowHeight - 5).lineTo(500, startY + rowHeight - 5).stroke();

    startY += rowHeight;
    startX = 40;

    // 📌 Dibujar filas
    doc.font('Helvetica').fontSize(9);
    data.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        doc.text(cell.toString(), startX, startY, { width: colWidths[index], align: 'center' });
        startX += colWidths[index];
      });

      // 📌 Línea separadora entre filas
      doc.moveTo(40, startY + rowHeight - 5).lineTo(500, startY + rowHeight - 5).stroke();

      startY += rowHeight;
      startX = 40;
    });
  }

  
}
