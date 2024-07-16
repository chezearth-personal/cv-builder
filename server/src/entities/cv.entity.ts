import { Entity, Column, Index, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { Model } from './model.entity'
import { CompanyDetail } from './company-detail.entity';

@Entity('cv')
export class Cv extends Model {
  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  occupation: string;

  @Column({ type: 'text' })
  headshot: string;

  // @Column()
  // mobile: string;

  @Column({ type: 'varchar', length: 18 })
  tel: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'text'})
  website: string;

  @Column({ type: 'json'})
  skillTopics: JSON;

  // @ManyToOne(typeFunctionOrTarget, inverseSide)
  @ManyToOne(() => CompanyDetail, companyDetails => companyDetails.cv)
  companyDetails: CompanyDetail[];
}
