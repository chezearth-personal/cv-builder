import { object, array, string, boolean, TypeOf, z} from 'zod';

export const KeyPhraseTopicSchema = object({
  name: string({ required_error: 'Skill topic name is required' }),
  itemList: z.optional(array(object({ name: string()})))
});
export const CompanyDetailSchema = object({
  name: string({ required_error: 'Company name is required' }),
  position: string({ required_error: 'Position is required' }),
  startDate: string({ required_error: 'Start date is required' }),
  endDate: z.optional(z.nullable(string())),
  isCurrent: z.nullable(boolean()),
  keyPhraseTopics: array(KeyPhraseTopicSchema)
    .nonempty({ message: 'At least one company detail is required' }),
}).refine(data => data.isCurrent !== Boolean(data.endDate), {
  message: 'End date is required if not current',
  path: ['endDate']
}).transform(data => {
  data.endDate = data.isCurrent
    ? (new Date()).toISOString().substring(0, 7)
    : data.endDate;
  return data;
});
export const CvInputSchema = object({
  body: object({
    fullName: string({ required_error: 'Full name is required' }),
    occupation: string({ required_error: 'Occupation is required' }),
    tel: string({ required_error: 'Telephone number is required' }),
    email: string({ required_error: 'Email is required' }),
    website: string(),
    skillTopics: array(KeyPhraseTopicSchema)
      .nonempty({ message: 'At least one skill topic is required' }),
    companyDetails: array(CompanyDetailSchema),
    keyPhraseTopics: z.optional(array(KeyPhraseTopicSchema))
  })
});

export type CvInput = TypeOf<typeof CvInputSchema>['body'];
export type KeyPhraseTopic = TypeOf<typeof KeyPhraseTopicSchema>;
export type CompanyDetail = TypeOf<typeof CompanyDetailSchema>;
