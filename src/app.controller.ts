import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get('test')
  testConnection(): string {
    return 'La conexión al backend funciona correctamente. PINGA';
  }
}
