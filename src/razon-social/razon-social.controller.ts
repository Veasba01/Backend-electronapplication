import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { RazonSocialService } from './razon-social.service';
import { RazonSocial } from './razon-social.entity';

@Controller('razones-sociales')
export class RazonSocialController {
  constructor(private readonly razonSocialService: RazonSocialService) {}

  @Post()
  async crear(@Body() data: Partial<RazonSocial>): Promise<RazonSocial> {
    return this.razonSocialService.crear(data);
  }

  @Get()
  async obtenerTodas(): Promise<RazonSocial[]> {
    return this.razonSocialService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number): Promise<RazonSocial> {
    return this.razonSocialService.obtenerPorId(id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: number,
    @Body() data: Partial<RazonSocial>,
  ): Promise<RazonSocial> {
    return this.razonSocialService.actualizar(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number): Promise<void> {
    return this.razonSocialService.eliminar(id);
  }
}
