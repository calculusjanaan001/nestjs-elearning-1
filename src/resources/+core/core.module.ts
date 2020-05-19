import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RolesGuard, AuthGuard } from './guards';

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
