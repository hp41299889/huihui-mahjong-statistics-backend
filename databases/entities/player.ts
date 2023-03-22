import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';

import { Round } from './round';

@Entity()
export class Player {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Round, round => round.east)
    east_round: Round[];

    @OneToMany(() => Round, round => round.south)
    south_round: Round[];

    @OneToMany(() => Round, round => round.west)
    west_round: Round[];

    @OneToMany(() => Round, round => round.north)
    north_round: Round[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
};