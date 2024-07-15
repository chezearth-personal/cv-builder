import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Model } from './model.entity'

@Entity('cvs')
export class Cv extends Model {
  @Column()
  name: string;

  @Column()
  occupation: string;

  @Column()
  headshot: string;
}
