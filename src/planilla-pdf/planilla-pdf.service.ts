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
      // 📌 Control para dos comprobantes por hoja (ajustado)
      if (index % 2 === 0 && index > 0) {
        doc.addPage();
      }
  
      // 📌 Posición optimizada para 2 comprobantes por hoja
      const comprobanteStartY = index % 2 === 0 ? 40 : 420; // Más espacio entre comprobantes
      const leftMargin = 40;
      const pageWidth = 550;
  
      // 📌 Encabezado del comprobante
      doc.fontSize(9).text(`Comprobante: ${index + 1}`, leftMargin, comprobanteStartY);
      doc.fontSize(11).text('COMPROBANTES DE PAGO', { align: 'center', underline: true });
      doc.fontSize(9).text(planilla.razonSocial.nombre.toUpperCase(), pageWidth - 160, comprobanteStartY);
  
      doc.text(empleado.panaderia.nombre, leftMargin, doc.y + 5);
      doc.text(`Quincena del ${planilla.fechaInicio} AL ${planilla.fechaFinal}`, { align: 'center' });
  
      let startY = doc.y + 15;      // 📌 Información del empleado (horizontal compacto)
      doc.font('Helvetica-Bold').fontSize(9);
      doc.text(`EMPLEADO: ${empleado.primerApellidoEmpleado} ${empleado.segundoApellidoEmpleado}, ${empleado.nombreEmpleado}`, leftMargin, startY);
      doc.text(`CÉDULA: ${empleado.cedulaEmpleado}`, leftMargin + 300, startY);
      startY += 12;
      doc.text(`SALARIO MENSUAL: ${empleado.salarioMes.toLocaleString()}`, leftMargin, startY);
      startY += 20;

      // 📌 Sección de Horas y Salarios (todo en una tabla horizontal)
      this.drawCompactTable(doc, [
        ['CONCEPTO', 'HORAS', 'TARIFA/MONTO', 'TOTAL'],
        ['Salario Normal', empleado.horasSencillas.toString(), `${(empleado.salarioNormal / empleado.horasSencillas || 0).toLocaleString()}`, `${empleado.salarioNormal.toLocaleString()}`],
        ['Horas Extras', empleado.horasExtras.toString(), `${empleado.horasExtras > 0 ? (empleado.salarioExtras / empleado.horasExtras).toLocaleString() : '0'}`, `${empleado.salarioExtras.toLocaleString()}`],
        ['Otros Ingresos', '-', '-', `${empleado.otrosIngresos.toLocaleString()}`],
        ['TOTAL BRUTO', '', '', `${empleado.salarioTotalBruto.toLocaleString()}`]
      ], [140, 60, 100, 100], startY);

      startY += 95;

      // 📌 Deducciones y Total (horizontal compacto)
      const totalDeducciones = empleado.ccss + empleado.bpdc + empleado.embargos + empleado.adelantos;
      this.drawCompactTable(doc, [
        ['DEDUCCIONES', 'CCSS', 'BANCO POP.', 'EMBARGOS', 'ADELANTOS', 'TOTAL DED.', 'NETO A PAGAR'],
        ['MONTOS', `${empleado.ccss.toLocaleString()}`, `${empleado.bpdc.toLocaleString()}`, `${empleado.embargos.toLocaleString()}`, `${empleado.adelantos.toLocaleString()}`, `${totalDeducciones.toLocaleString()}`, `${empleado.salarioNeto.toLocaleString()}`]
      ], [70, 70, 70, 70, 70, 70, 90], startY);      startY += 55;

      // 📌 Línea separadora entre comprobantes (solo si no es el último del par)
      if (index % 2 === 0) {
        doc.moveTo(leftMargin, startY + 10).lineTo(pageWidth, startY + 10).stroke('#cccccc');
      }
    });
  
    // 📌 Finalizar documento
    doc.end();
  }
  /**
   * 📌 Función para dibujar tablas en el PDF con diseño espacioso y legible.
   */
  private drawTable(doc: any, data: any[][], colWidths: number[], startY: number, boldLastRow = false) {
    const leftMargin = 40;
    let currentY = startY;
    const rowHeight = 22;
    const cellPadding = 8;

    // 📌 Dibujar cada fila con bordes y espaciado
    data.forEach((row, rowIndex) => {
      let currentX = leftMargin;
      
      row.forEach((cell, colIndex) => {
        const cellWidth = colWidths[colIndex];
        
        // Configurar estilo según el tipo de fila
        if (rowIndex === 0) {
          // Encabezado con fondo gris y borde más grueso
          doc.rect(currentX, currentY, cellWidth, rowHeight)
             .fillAndStroke('#e8e8e8', '#000000');
        } else if (boldLastRow && rowIndex === data.length - 1) {
          // Última fila destacada para totales
          doc.rect(currentX, currentY, cellWidth, rowHeight)
             .fillAndStroke('#f5f5f5', '#000000');
        } else {
          // Filas normales
          doc.rect(currentX, currentY, cellWidth, rowHeight)
             .stroke('#666666');
        }
        
        currentX += cellWidth;
      });
      
      currentY += rowHeight;
    });

    // 📌 Agregar texto con mejor espaciado
    currentY = startY;
    data.forEach((row, rowIndex) => {
      let currentX = leftMargin;
      
      // Configurar fuente según el tipo de fila
      if (rowIndex === 0) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000');
      } else if (boldLastRow && rowIndex === data.length - 1) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000');
      } else {
        doc.font('Helvetica').fontSize(9).fillColor('#333333');
      }
      
      row.forEach((cell, colIndex) => {
        const cellWidth = colWidths[colIndex];
        const textY = currentY + (rowHeight / 2) - 4; // Centrar verticalmente
        
        // Alineación mejorada
        let alignment = 'left';
        let textX = currentX + cellPadding;
        
        if (colIndex === 0) {
          alignment = 'left'; // Primera columna siempre a la izquierda
        } else if (typeof cell === 'string' && (cell.includes('₡') || !isNaN(Number(cell.replace(/[₡,]/g, ''))))) {
          alignment = 'right'; // Números y montos a la derecha
          textX = currentX + cellWidth - cellPadding;
        } else {
          alignment = 'center'; // Resto centrado
          textX = currentX + (cellWidth / 2);
        }
        
        const textOptions: any = { 
          width: cellWidth - (cellPadding * 2), 
          align: alignment,
          lineBreak: false
        };
        
        if (alignment === 'center') {
          textOptions.width = cellWidth;
          textX = currentX;
        } else if (alignment === 'right') {
          textOptions.width = cellWidth - cellPadding;
          textX = currentX + cellPadding;
        }
        
        doc.text(cell.toString(), textX, textY, textOptions);
        
        currentX += cellWidth;
      });
      
      currentY += rowHeight;
    });
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

  /**
   * 📌 Función para dibujar tablas compactas horizontales optimizadas para comprobantes.
   */
  private drawCompactTable(doc: any, data: any[][], colWidths: number[], startY: number) {
    const leftMargin = 40;
    let currentY = startY;
    const rowHeight = 18;
    const cellPadding = 3;

    // 📌 Dibujar cada fila con bordes compactos
    data.forEach((row, rowIndex) => {
      let currentX = leftMargin;
      
      row.forEach((cell, colIndex) => {
        const cellWidth = colWidths[colIndex];
        
        // Configurar estilo según el tipo de fila
        if (rowIndex === 0) {
          // Encabezado con fondo gris
          doc.rect(currentX, currentY, cellWidth, rowHeight)
             .fillAndStroke('#e0e0e0', '#000000');
        } else if (rowIndex === data.length - 1 && (cell.toString().includes('TOTAL') || cell.toString().includes('NETO'))) {
          // Última fila destacada para totales
          doc.rect(currentX, currentY, cellWidth, rowHeight)
             .fillAndStroke('#f8f8f8', '#000000');
        } else {
          // Filas normales
          doc.rect(currentX, currentY, cellWidth, rowHeight)
             .stroke('#666666');
        }
        
        currentX += cellWidth;
      });
      
      currentY += rowHeight;
    });

    // 📌 Agregar texto compacto
    currentY = startY;
    data.forEach((row, rowIndex) => {
      let currentX = leftMargin;
      
      // Configurar fuente según el tipo de fila
      if (rowIndex === 0) {
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#000000');
      } else if (rowIndex === data.length - 1 && (row.some(cell => cell.toString().includes('TOTAL') || cell.toString().includes('NETO')))) {
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#000000');
      } else {
        doc.font('Helvetica').fontSize(8).fillColor('#333333');
      }
      
      row.forEach((cell, colIndex) => {
        const cellWidth = colWidths[colIndex];
        const textY = currentY + (rowHeight / 2) - 3; // Centrar verticalmente
        
        // Alineación inteligente
        let alignment = 'center';
        if (colIndex === 0) {
          alignment = 'left'; // Primera columna a la izquierda
        } else if (cell.toString().includes('₡') || !isNaN(Number(cell.toString().replace(/[₡,]/g, '')))) {
          alignment = 'right'; // Números y montos a la derecha
        }
        
        const textOptions: any = { 
          width: cellWidth - (cellPadding * 2), 
          align: alignment,
          lineBreak: false
        };
        
        const textX = currentX + cellPadding;
        doc.text(cell.toString(), textX, textY, textOptions);
        
        currentX += cellWidth;
      });
      
      currentY += rowHeight;
    });
  }

  
}
