import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'capabilities' })
export class Capability {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    value: string;

    @Column()
    level: number;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => User, user => user.capabilities)
    users: User[];
}