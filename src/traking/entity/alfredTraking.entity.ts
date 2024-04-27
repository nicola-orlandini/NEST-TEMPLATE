import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'alfred_tracking' })
export class AlfredTraking {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    shipment_id: number;

    @Column()
    alfred_status: string;

    @Column()
    data_inserimento: Date;
}