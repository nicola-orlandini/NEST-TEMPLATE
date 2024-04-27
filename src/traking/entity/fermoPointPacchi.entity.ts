import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fermopoint_pacchi' })
export class FermoPointPacchi {
  @PrimaryGeneratedColumn()
  Id_pacchi_fermopoint: number;

  @Column()
  barcode_pacco: string;
}
