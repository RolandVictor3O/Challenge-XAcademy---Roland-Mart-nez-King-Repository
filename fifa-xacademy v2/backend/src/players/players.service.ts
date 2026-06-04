import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

    findAll(page = 1, limit = 10) {
      return this.playersRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });
    }

  create(data: Partial<Player>) {
    const player = this.playersRepository.create(data);
    return this.playersRepository.save(player);
  }
}