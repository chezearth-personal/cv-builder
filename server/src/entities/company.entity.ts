import { Entity, Column, OneToMany } from 'typeorm';
import { Model } from './model.entity';
import { CompanyDetail } from './company-detail.entity';

@Entity('company', { schema: 'cv_builder' })
export class Company extends Model {
  @Column('text')
  name: string;

  @Column('varchar', { length: 18 })
  tel: string;

  @Column('text')
  email: string;

  @Column('text')
  website: string;

  @OneToMany(() => CompanyDetail, companyDetail => companyDetail.companyDetailCompany)
  companyDetails: CompanyDetail[];
}
