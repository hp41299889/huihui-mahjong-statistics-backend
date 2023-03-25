// import {
//     Entity,
//     ManyToOne,
//     Column,
//     PrimaryGeneratedColumn,
//     OneToMany,
//     CreateDateColumn
// } from 'typeorm';

// import { Player } from './player';
// import { Record } from './record';

// export {
//     DeskType,
//     Round
// };

// enum DeskType {
//     AUTO = 'auto',
//     MANUAL = 'manual'
// };

// @Entity()
// class Round {
//     @PrimaryGeneratedColumn('uuid')
//     uid: string;

//     @Column({
//         type: 'enum',
//         enum: DeskType,
//         default: DeskType.AUTO
//     })
//     deskType: DeskType;

//     @Column({ type: 'smallint' })
//     base: number;

//     @Column({ type: 'smallint' })
//     point: number;

//     @ManyToOne(() => Player, { eager: true })
//     east: Player;

//     @ManyToOne(() => Player, { eager: true })
//     south: Player;

//     @ManyToOne(() => Player, { eager: true })
//     west: Player;

//     @ManyToOne(() => Player, { eager: true })
//     north: Player;

//     @OneToMany(() => Record, (record) => record.round)
//     records: Record[];

//     @CreateDateColumn({ type: 'timestamp' })
//     createdAt: Date;
// };
import { EntitySchema } from 'typeorm';
import { IPlayer } from './player';
import { IRecord } from './record';

enum EDeskType {
    AUTO = 'auto',
    MANUAL = 'manual'
};

interface IRound {
    uid: string;
    deskType: EDeskType;
    base: number;
    point: number;
    east: IPlayer;
    south: IPlayer;
    west: IPlayer;
    north: IPlayer;
    records: IRecord[];
    createdAt: Date;
    updatedAt: Date;
};

const Round = new EntitySchema<IRound>({
    name: 'round',
    columns: {
        uid: {
            primary: true,
            type: String,
            generated: 'uuid'
        },
        deskType: {
            type: 'enum',
            enum: EDeskType,
            default: EDeskType.AUTO
        },
        base: {
            type: Number
        },
        point: {
            type: Number
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
        east: {
            target: 'player',
            type: 'many-to-one',
            joinColumn: { name: 'playerId' },
            inverseSide: 'rounds'
        },
        south: {
            target: 'player',
            type: 'many-to-one',
            joinColumn: { name: 'playerId' },
            inverseSide: 'rounds'
        },
        west: {
            target: 'player',
            type: 'many-to-one',
            joinColumn: { name: 'playerId' },
            inverseSide: 'rounds'
        },
        north: {
            target: 'player',
            type: 'many-to-one',
            joinColumn: { name: 'playerId' },
            inverseSide: 'rounds'
        },
    }
});

export { IRound, EDeskType };
export default Round;