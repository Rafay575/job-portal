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
  workPermit: boolean | null;
  nameChanged: boolean | null;
  previousName: string;
  changedTo: string;
  userId?: number | string | null;
  cvFile?:  File | null;
};

export type Step2Type = {
  availabilityIssue: boolean | null;
  workRestrictions: boolean | null;
  restrictionDetails: string;
  overtime: boolean | null;
  hoursAvoid: string;
  noticePeriod: string;
  workedBefore: boolean | null;
  appliedBefore: boolean | null;
  appliedDetails: string;
};

export type Step3Type = {
  hasConvictions: boolean | null;
  convictionDetails: string;
  hasUnspentConvictions: boolean | null;
  unspentDetails: string;
  fitnessInvestigation: boolean | null;
  removedFromRegister: boolean | null;
  crb: boolean | null;
  certificateNumber: string;  // ← NEW FIELD (before surname)
  fullName: string;    
  surname: string;
  dob: string;
  crbFile: File | string | null;
};

export type Step4Type = {
  absentDays: string;
  onMedication: boolean | null;
  medicationDetails: string;
  healthTreatment: boolean | null;
  treatmentDetails: string;
  medicalCondition: boolean | null;
  conditionDetails: string;
  disabled: boolean | null;
  impairmentType: string;
  nightShiftFit: boolean | null;
};

export type Step5Type = {
  isNurse: boolean | null;
  professionalBody: string;
  registrationType: string;
  registrationNumber: string;
  registrationExpiry: string;
};

export type Step6Type = {
  passport: File | string | null;
  drivingLicenceFront: File | string | null;  // ← RENAMED
  drivingLicenceBack: File | string | null;  
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
  completed: "yes" | "no"| undefined;
  additionalNotes: string;
  hasProfessionalRegistration: "yes" | "no"| undefined;
  registrationBody: string;
  registrationNumber: string;
  registrationExpiry: string;
  certificateFile: File | string | null;
  existingCertificateFile?: string | null; 
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
  declarationConfirmed: boolean | undefined;
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
