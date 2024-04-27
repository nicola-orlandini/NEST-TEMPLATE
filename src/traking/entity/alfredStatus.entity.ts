import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'alfred_status' })
export class AlfredStatus {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    code: string;

    @Column()
    it: string;
}