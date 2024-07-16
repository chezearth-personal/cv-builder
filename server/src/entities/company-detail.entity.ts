import { Entity, Column, Index, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Cv } from './cv.entity';
import { Company } from './company.entity';
import { Model } from './model.entity'

@Entity('company_detail', { schema: 'cv_builder' })
export class CompanyDetail extends Model {
  @OneToMany(() => Company, company => company.companyDetails)
  company: Company;

  @OneToMany(() => Cv, cv => cv.companyDetails)
  cv: Cv;
}
