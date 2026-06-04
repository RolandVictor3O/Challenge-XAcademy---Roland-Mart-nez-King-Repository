import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';
export declare class PlayersController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    findAll(): Promise<import("./entities/player.entity").Player[]>;
    create(createPlayerDto: CreatePlayerDto): Promise<import("./entities/player.entity").Player>;
}
