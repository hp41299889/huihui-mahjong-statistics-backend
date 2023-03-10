import {
    Entity,
    ManyToOne,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { Player } from './player';

enum Wind {
    EAST = 'east',
    SOUTH = 'south',
    WEST = 'west',
    NORTH = 'north'
};

enum DeskType {
    AUTO = 'auto',
    MANUAL = 'manual'
};

@Entity()
export class Record {
    @PrimaryGeneratedColumn('increment')
    _id: number;

    @ManyToOne(() => Player, player => player.record)
    player: Player;

    @Column({ type: 'enum', enum: Wind })
    position: Wind;

    @Column({ type: 'smallint' })
    win: number;

    @Column({ type: 'smallint' })
    drawn: number;

    @Column({ type: 'smallint' })
    lose: number;

    @Column()
    amount: number;

    @Column({
        type: 'enum',
        enum: DeskType,
        default: DeskType.AUTO
    })
    deskType: DeskType;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
};