import { Entity, Column, Index, OneToMany } from 'typeorm';
import { Model } from './model.entity'
import { CompanyDetail } from './company-detail.entity';

@Entity('cv', { schema: 'cv_builder' })
export class Cv extends Model {
  @Index('fullname_index')
  @Column({name: 'full_name', type: 'text' })
  fullName: string;

  @Index('occupation_index')
  @Column({ type: 'text' })
  occupation: string;

  @Column({name: 'image_url', type: 'text' })
  imageUrl: string;

  // @Column()
  // mobile: string;

  @Index('tel_index')
  @Column({ type: 'varchar', length: 18 })
  tel: string;

  @Index('email_index')
  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Index('website_index')
  @Column({ type: 'text'})
  website: string;

  @Column({ name: 'skill_topics', type: 'json'})
  skillTopics: JSON;

  @OneToMany(() => CompanyDetail, companyDetail => companyDetail.companyDetailCv, { cascade: true })
  companyDetails: CompanyDetail[];
}
