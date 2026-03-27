export type Step1FullTimeType = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string; 
  nationality: string;
  immigrationStatus: string;
  immigrationExpiry: string;
  workPermit: "yes" | "no";
  nameChanged: "yes" | "no";
  previousName: string;
  changedTo: string;
  cvFile?: File | null;
};

export type Step2Type = {
  availabilityIssue: "yes" | "no";
  workRestrictions: "yes" | "no";
  restrictionDetails: string;
  overtime: "yes" | "no";
  hoursAvoid: string;
  noticePeriod: string;
  workedBefore: "yes" | "no";
  appliedBefore: "yes" | "no";
  appliedDetails: string;
};

export type Step3Type = {
  hasConvictions: "yes" | "no";
  convictionDetails: string;
  hasUnspentConvictions: "yes" | "no";
  unspentDetails: string;
  fitnessInvestigation: "yes" | "no";
  removedFromRegister: "yes" | "no";
  crb: "yes" | "no";
  surname: string;
  dob: string;
  crbFile: File | null;
};

export type Step4Type = {
  absentDays: string;
  absencePeriods: string;
  onMedication: "yes" | "no";
  medicationDetails: string;
  healthTreatment: "yes" | "no";
  treatmentDetails: string;
  medicalCondition: "yes" | "no";
  conditionDetails: string;
  disabled: "yes" | "no";
  impairmentType: string;
  nightShiftFit: "yes" | "no";
};

export type Step5Type = {
  isNurse: "yes" | "no";
  professionalBody: string;
  registrationType: string;
  registrationNumber: string;
  registrationExpiry: string;
};

export type Step6Type = {
  passport: File | null;
  drivingLicence: File | null;
  proofId1: File | null;
  proofId2: File | null;
}
export type Step7Type = {
  title: string;
  provider: string;
  duration: string;
  completionDate: string;
};

export type EducationEntry = {
  kind?: "education";
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
  certificateFile: File | null;
};

 export type GapEntry8 = {
  kind?: "gap";
  id: number;
  gapFrom: string;
  gapTo: string;
  reason: string;
};

export type Step8Type = EducationEntry | GapEntry8;

export type ExperienceEntry = {
  kind?: "experience";
  id: number;
  employerName: string;
  dateFrom: string;
  dateTo: string;
  jobTitle: string;
  duties: string;
};

 export type GapEntry9 = {
  kind?: "gap";
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

export type Step10Type ={
 supportingStatement: string;
};
export type Step11Type ={
  declarationConfirmed: boolean;
  declarationDate: string;
  signatureFile: File | null;
};

export type Form={
    Step1:Step1FullTimeType,
    Step2:Step2Type,
    Step3:Step3Type,
    Step4:Step4Type,
    Step5:Step5Type,
    Step6:Step6Type,
    Step7:Step7Type,
    Step8:Step8Type[],
    Step9:Step9Type,
    Step10:Step10Type,
    Step11:Step11Type,
}