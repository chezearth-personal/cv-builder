import { Entity, Column, Index, BeforeInsert, ManyToOne } from 'typeorm';
import { Model } from './model.entity'
import { Cv } from './cv.entity';
// import {CompanyDetail} from './company-detail.entity';

@Entity('company', { schema: 'cv_builder' })
export class Company extends Model {
  @Index('companyname_index')
  @Column({ type: 'text' })
  name: string;

  @Index('position_index')
  @Column({ type: 'text' })
  position: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true})
  end_date: Date | null;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_current: boolean;

  @Column({ type: 'text' })
  work_prompt: string;

  @Column({ type: 'text' })
  key_phrase_text: string;

  @Column({ type: 'json' })
  key_phrase_topics: JSON;

  @ManyToOne(() => Cv, cv => cv.companies, { cascade: true })
  cv: Cv;

  @BeforeInsert()
  async updateEndDate() {
    this.end_date = this.is_current ? null : this.end_date;
  }
}
