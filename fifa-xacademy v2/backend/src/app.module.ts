import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayersModule } from './players/players.module';
import { Player } from './players/entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'fifa',
      entities: [Player],
      synchronize: true,
    }),
    PlayersModule,
  ],
})
export class AppModule {}