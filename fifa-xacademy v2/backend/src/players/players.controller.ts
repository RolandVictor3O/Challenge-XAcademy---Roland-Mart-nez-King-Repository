import { CreatePlayerDto } from './dto/create-player.dto';

import { Controller, Get, Post, Body } from '@nestjs/common';

import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    console.log('DTO RECIBIDO:', createPlayerDto);
    return this.playersService.create(createPlayerDto);
  }
}