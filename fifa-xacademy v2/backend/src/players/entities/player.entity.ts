import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  club: string;

  @Column()
  position: string;

  @Column()
  nationality: string;

  @Column()
  overall: number;

  @Column({ default: 0 })
  pace: number;

  @Column({ default: 0 })
  shooting: number;

  @Column({ default: 0 })
  passing: number;

  @Column({ default: 0 })
  dribbling: number;

  @Column({ default: 0 })
  defending: number;

  @Column({ default: 0 })
  physical: number;
}