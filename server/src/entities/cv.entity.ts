import { Entity, Column, Index, OneToMany } from 'typeorm';
import { Model } from './model.entity'
import { Company } from './company.entity';
// import { CompanyDetail } from './company-detail.entity';

@Entity('cv', { schema: 'cv_builder' })
export class Cv extends Model {
  @Index('fullname_index')
  @Column({ type: 'text' })
  fullName: string;

  @Index('occupation_index')
  @Column({ type: 'text' })
  occupation: string;

  @Index('location_index')
  @Column({ type: 'text' })
  image_url: string;

  // @Column()
  // mobile: string;

  @Column({ type: 'varchar', length: 18 })
  tel: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'text'})
  website: string;

  @Column({ type: 'json'})
  skill_topics: JSON;

  @OneToMany(() => Company, companies => companies.cv, { cascade: true })
  companies: Company[];
}
