import { Entity, Column, OneToOne } from 'typeorm';
import { Model } from './model.entity';

@Entity('cv_text', {schema: 'cv_builder'})
export class CvText extends Model {
  @Column('text', { nullable: true })
  profile: string;

  @Column('work-history', { nullable: true })
  workHistory: JSON;
}
