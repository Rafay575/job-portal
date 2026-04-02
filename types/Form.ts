export type Step1FullTimeType = {
  type:string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  nationality: string;
  immigrationStatus: string;
  immigrationExpiry: string;
  workPermit: boolean;
  nameChanged: boolean;
  previousName: string;
  changedTo: string;
  userId?: number | string | null;
  cvFile?: any;
};

export type Step2Type = {
  availabilityIssue: boolean;
  workRestrictions: boolean;
  restrictionDetails: string;
  overtime: boolean;
  hoursAvoid: string;
  noticePeriod: string;
  workedBefore: boolean;
  appliedBefore: boolean;
  appliedDetails: string;
};

export type Step3Type = {
  hasConvictions: boolean;
  convictionDetails: string;
  hasUnspentConvictions: boolean;
  unspentDetails: string;
  fitnessInvestigation: boolean;
  removedFromRegister: boolean;
  crb: boolean;
  surname: string;
  dob: string;
  crbFile: File | string | null;
};

export type Step4Type = {
  absentDays: string;
  absencePeriods: string;
  onMedication: boolean;
  medicationDetails: string;
  healthTreatment: boolean;
  treatmentDetails: string;
  medicalCondition: boolean;
  conditionDetails: string;
  disabled: boolean;
  impairmentType: string;
  nightShiftFit: boolean;
};

export type Step5Type = {
  isNurse: boolean;
  professionalBody: string;
  registrationType: string;
  registrationNumber: string;
  registrationExpiry: string;
};

export type Step6Type = {
  passport: File | string | null;
  drivingLicence: File | string | null;
  proofId1: File | string | null;
  proofId2: File | string | null;
};
export type Step7Type = {
  title: string;
  provider: string;
  duration: string;
  completionDate: string;
};

export type EducationEntry = {
  kind: "education";
  id: number;
  qualificationType: string;
  qualificationTitle: string;
  institutionName: string;
  institutionCountry: string;
  awardingBody: string;
  gradeOrResult: string;
  startDate: string;
  endDate: string;
  completed: "yes" | "no";
  additionalNotes: string;
  hasProfessionalRegistration: "yes" | "no";
  registrationBody: string;
  registrationNumber: string;
  registrationExpiry: string;
  certificateFile: File | string | null;
};

export type GapEntry8 = {
  kind: "gap";
  id: number;
  gapFrom: string;
  gapTo: string;
  reason: string;
};

export type Step8Type = EducationEntry | GapEntry8;

export type ExperienceEntry = {
  kind: "experience";
  id: number;
  employerName: string;
  dateFrom: string;
  dateTo: string;
  jobTitle: string;
  duties: string;
};

export type GapEntry9 = {
  kind: "gap";
  id: number;
  gapFrom: string;
  gapTo: string;
  reason: string;
};


export type TimelineEntry9 = ExperienceEntry | GapEntry9;

export type Step9Type = {
  areas: string[];
  timeline: TimelineEntry9[];
};

export type Step10Type = {
  supportingStatement: string;
};
export type Step11Type = {
  declarationConfirmed: boolean;
  declarationDate: string;
  signatureFile: File | string | null ;
};

export type Form = {
  Step1: Step1FullTimeType;
  Step2: Step2Type;
  Step3: Step3Type;
  Step4: Step4Type;
  Step5: Step5Type;
  Step6: Step6Type;
  Step7: Step7Type[];
  Step8: Step8Type[];
  Step9: Step9Type;
  Step10: Step10Type;
  Step11: Step11Type;
};
// export type TimelineItem = {
//   id: number;  // Add id for tracking
//   kind: "education" | "gap";

//   // education
//   qualificationType: string;
//   qualificationTitle: string;
//   institutionName: string;
//   institutionCountry: string;
//   awardingBody: string;
//   gradeOrResult: string;
//   startDate: string;
//   endDate: string;
//   completed: "yes" | "no";  // Change to "yes" | "no"
//   hasProfessionalRegistration: "yes" | "no";  // Change to "yes" | "no"
//   registrationBody: string;
//   registrationNumber: string;
//   registrationExpiry: string;
//   certificateFile: string | File | null;  // Allow File or string
//   additionalNotes: string;

//   // gap
//   gapFrom: string;
//   gapTo: string;
//   reason: string;
// };