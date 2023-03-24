// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany
// } from 'typeorm';

// import { Round } from './round';

// @Entity()
// export class Player {
//     @PrimaryGeneratedColumn('increment')
//     id: number;

//     @Column({ unique: true })
//     name: string;

//     @OneToMany(() => Round, round => round.east)
//     east_round: Round[];

//     @OneToMany(() => Round, round => round.south)
//     south_round: Round[];

//     @OneToMany(() => Round, round => round.west)
//     west_round: Round[];

//     @OneToMany(() => Round, round => round.north)
//     north_round: Round[];

//     @CreateDateColumn({ type: 'timestamp' })
//     createdAt: Date;

//     @UpdateDateColumn({ type: 'timestamp' })
//     updatedAt: Date;
// };
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';

import { IRound } from './round';

interface IPlayer {
    id: number;
    name: string;
    rounds: IRound[];
    createdAt: Date;
    updatedAt: Date;
};

const Player = new EntitySchema<IPlayer>({
    name: 'player',
    columns: {
        id: {
            primary: true,
            type: Number,
            generated: true
        } as EntitySchemaColumnOptions,
        name: {
            type: String,
            unique: true
        },
        createdAt: {
            name: 'created_at',
            type: 'timestamp',
            createDate: true
        },
        updatedAt: {
            name: 'updated_at',
            type: 'timestamp',
            updateDate: true
        }
    },
    relations: {
        rounds: {
            target: 'round',
            type: 'one-to-many',
            inverseSide: 'player',
            cascade: true,
        }
    }
});

export { IPlayer };
export default Player;