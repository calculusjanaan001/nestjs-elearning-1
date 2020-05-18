import { Module, Global } from '@nestjs/common';

import { RolesGuard, AuthGuard } from './guards';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_KEY,
      }),
    }),
  ],
  providers: [RolesGuard, AuthGuard],
  exports: [JwtModule, RolesGuard, AuthGuard],
})
export class CoreModule {}
