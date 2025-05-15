export interface AwardFormData {
  title: string;
  code: string;
  unionName: string;
  employer: string;
  type: string;
  commencementDate: string;
  registrationDate: string;
  duration: string;
  gazetteNumber: string;
  gazetteDate: string;
  status: 'draft' | 'published';
  description: string;
}
