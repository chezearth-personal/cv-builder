import { Entity, Column, Index, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { Model } from './model.entity'
import {CompanyDetail} from './company-detail.entity';

@Entity('company')
export class Company extends Model {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  position: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true})
  endDate: Date | null;

  @Column({ type: 'boolean', default: false, nullable: false })
  isCurrent: boolean;

  @Column({ type: 'text' })
  workPrompt: string;

  @Column({ type: 'text' })
  keyPhraseText: string;

  @Column({ type: 'json' })
  keyPhraseTopics: JSON;

  @ManyToOne(() => CompanyDetail, companyDetails => companyDetails.company)
  companyDetails: CompanyDetail[];

  @BeforeInsert()
  async updateEndDate() {
    this.endDate = this.isCurrent ? null : this.endDate;
  }
}
