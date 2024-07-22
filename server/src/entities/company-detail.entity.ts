import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Model } from './model.entity'
import { Cv } from './cv.entity';
import { Company } from './company.entity';

@Entity('company_detail', { schema: 'cv_builder' })
export class CompanyDetail extends Model {
  // @Index('companyname_index')
  // @Column({ type: 'text' })
  // name: string;

  @Index('position_index')
  @Column({ type: 'text' })
  position: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true})
  endDate: Date | null;

  @Column({ name: 'is_current', type: 'boolean', default: false, nullable: false })
  isCurrent: boolean;

  @Column({ name: 'work_prompt', type: 'text' })
  workPrompt: string;

  @Column({ name: 'key_phrase_text', type: 'text' })
  keyPhraseText: string;

  @Column({ name: 'key_phrase_topics', type: 'json' })
  keyPhraseTopics: JSON;

  @ManyToOne(() => Cv)
  @JoinColumn({ name: 'company_detail_cv_fk' })
  companyDetailCv: Cv;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_detail_company_fk' })
  companyDetailCompany: Company;

  @BeforeInsert()
  async updateEndDate() {
    this.endDate = this.isCurrent ? null : this.endDate;
  }
}
