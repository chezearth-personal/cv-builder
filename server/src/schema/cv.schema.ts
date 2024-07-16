import { object, array, string, TypeOf, z } from 'zod';

export const CvSchema = object({
  body: object({
    fullName: string({ required_error: 'Full name is required' }),
    occupation: string({ required_error: 'Occupation is required' }),
    tel: string({ required_error: 'Telephone number is required' }),
    email: string({ required_error: 'Email is required' }),
    website: string(),
    skillTopics: array(object({ name: string()})),
    companyDetails: array(object({ name: string()}))
  })
});
export type Cv = TypeOf<typeof CvSchema>['body'];
