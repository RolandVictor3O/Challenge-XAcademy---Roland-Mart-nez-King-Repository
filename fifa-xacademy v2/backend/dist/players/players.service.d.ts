import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
export declare class PlayersService {
    private playersRepository;
    constructor(playersRepository: Repository<Player>);
    findAll(page?: number, limit?: number): Promise<Player[]>;
    create(data: Partial<Player>): Promise<Player>;
}
