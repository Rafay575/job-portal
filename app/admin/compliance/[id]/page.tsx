"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    id: 1,
    personalInformation: {
      fullName: "Daniel Ahmed",
      email: "daniel.ahmed@example.com",
      phoneNumber: "+44 7700 900123",
      currentAddress: "12 Greenfield Road, Birmingham",
      postcode: "B15 2TT",
      nationality: "British",
      immigrationStatus: "British Citizen",
      immigrationExpiryDate: "2027-06-15",
      needsUkWorkPermit: false,
      changedNameBefore: true,
      previousName: "Daniel Khan",
      changedTo: "Daniel Ahmed",
    },

    preQualifying: {
      limitedAvailabilityActivity: false,
      workRestrictions: true,
      restrictionDetails:
        "Non-compete agreement with previous employer (expires March 2026)",
      willingOvertime: true,
      unavailableHours: "Sunday mornings",
      noticePeriod: "4 weeks",
      workedBefore: false,
      appliedBefore: true,
      appliedDetails: "Applied in 2023 for Support Worker role",
    },

    criminalCompliance: {
      anyConvictions: true,
      convictionDetails: "Hello",
      anyUnspentConvictions: true,
      unspentDetails: "Hello",
      fitnessToPracticeInvestigation: false,
      removedFromRegister: false,
      dbsNumber: "DBS123456789",
      dbsExpiryDate: "2027-06-15",
    },

    healthInformation: {
      absentDaysLast3Years: 5,
      absencePeriodsLast3Years: 2,
      takingMedication: true,
      medicationDetails: "Seasonal allergy medication",
      healthTreatment: true,
      treatmentDetails: "Hello",
      medicalConditionAffectingDuties: true,
      medicalConditionDetails: "Hello",
      considerDisabled: true,
      impairmentType: "Hello",
      fitForNightShift: true,
    },

    professionalRegistration: {
      professionalBodyName: "NMC",
      registrationType: "Registered Nurse",
      pinNumber: "12A3456B",
      expiryDate: "2026-11-30",
    },

    references: [
      {
        referenceName: "Sarah Thompson",
        position: "Clinical Manager",
        relationship: "Line Manager",
        contactNumber: "+44 7700 900456",
        email: "sarah.thompson@healthcare.org",
      },
      {
        referenceName: "Michael Roberts",
        position: "Senior Nurse",
        relationship: "Supervisor",
        contactNumber: "+44 7700 900789",
        email: "michael.roberts@carehome.co.uk",
      },
    ],

    trainingCourses: [
      {
        courseTitle: "Safeguarding Adults Level 3",
        trainingProvider: "Health Training UK",
        duration: "2 Days",
        completionDate: "2024-03-12",
      },
      {
        courseTitle: "Medication Administration",
        trainingProvider: "Care Skills Academy",
        duration: "1 Day",
        completionDate: "2024-06-20",
      },
    ],

    employmentHistory: [
      {
        employerName: "Sunrise Care Home",
        address: "45 Park Lane, Manchester",
        typeOfBusiness: "Residential Care",
        jobTitle: "Support Worker",
        phone: "+44 161 123 4567",
        startDate: "2021-01-15",
        endDate: "2023-08-30",
        grade: "Band 3",
        salary: "£22,000",
        specialty: "Elderly Care",
        jobType: "Full-Time",
        reasonForLeaving: "Career progression",
        dutiesResponsibilities:
          "Provided personal care, assisted with medication, supported daily living activities and maintained care records.",
      },
      {
        employerName: "City Mental Health Trust",
        address: "12 Broad Street, Birmingham",
        typeOfBusiness: "Mental Health Services",
        jobTitle: "Healthcare Assistant",
        phone: "+44 121 987 6543",
        startDate: "2019-05-10",
        endDate: "2020-12-20",
        grade: "Band 2",
        salary: "£19,500",
        specialty: "Mental Health",
        jobType: "Full-Time",
        reasonForLeaving: "Relocation",
        dutiesResponsibilities:
          "Supported patients with mental health conditions, monitored wellbeing, documented observations and assisted clinical staff.",
      },
    ],

    mandatoryExperience: {
      experienceAreas: ["Mental Health", "Learning Disabilities", "Elderly"],
      definitionOfVulnerablePeople:
        "Individuals who may be at risk due to age, disability, illness or social circumstances and require additional support.",
      measuresToEnsureCare:
        "Following safeguarding procedures, regular risk assessments, clear communication and maintaining dignity and respect.",
      helpNonVerbalClient:
        "Use visual aids, body language cues and offer simple choices to support decision making.",
      actionIfWitnessAbuse:
        "Immediately report to safeguarding lead and follow organisational reporting procedures.",
    },

    supportingStatement: {
      statement:
        "I am applying for this role because I am passionate about providing high-quality care to vulnerable individuals. My previous experience in mental health and elderly care has equipped me with the skills required to deliver safe and compassionate support.",
    },

    declaration: {
      confirmed: true,
      signature: "Daniel Ahmed",
      date: "2026-02-27",
    },
  },
  {
    id: 2,
    personalInformation: {
      fullName: "John Gilbert",
      email: "daniel.ahmed@example.com",
      phoneNumber: "+44 7700 900123",
      currentAddress: "12 Greenfield Road, Birmingham",
      postcode: "B15 2TT",
      nationality: "British",
      immigrationStatus: "British Citizen",
      immigrationExpiryDate: null,
      needsUkWorkPermit: false,
      changedNameBefore: true,
      previousName: "Daniel Khan",
      changedTo: "Daniel Ahmed",
    },

    preQualifying: {
      limitedAvailabilityActivity: false,
      workRestrictions: true,
      restrictionDetails:
        "Non-compete agreement with previous employer (expires March 2026)",
      willingOvertime: true,
      unavailableHours: "Sunday mornings",
      noticePeriod: "4 weeks",
      workedBefore: false,
      appliedBefore: true,
      appliedDetails: "Applied in 2023 for Support Worker role",
    },

    criminalCompliance: {
      anyConvictions: false,
      convictionDetails: "",
      anyUnspentConvictions: false,
      unspentDetails: "",
      fitnessToPracticeInvestigation: false,
      removedFromRegister: false,
      dbsNumber: "DBS123456789",
      dbsExpiryDate: "2027-06-15",
    },

    healthInformation: {
      absentDaysLast3Years: 5,
      absencePeriodsLast3Years: 2,
      takingMedication: true,
      medicationDetails: "Seasonal allergy medication",
      healthTreatment: false,
      treatmentDetails: "",
      medicalConditionAffectingDuties: false,
      medicalConditionDetails: "",
      considerDisabled: false,
      impairmentType: "",
      fitForNightShift: true,
    },

    professionalRegistration: {
      professionalBodyName: "NMC",
      registrationType: "Registered Nurse",
      pinNumber: "12A3456B",
      expiryDate: "2026-11-30",
    },

    references: [
      {
        referenceName: "Sarah Thompson",
        position: "Clinical Manager",
        relationship: "Line Manager",
        contactNumber: "+44 7700 900456",
        email: "sarah.thompson@healthcare.org",
      },
      {
        referenceName: "Michael Roberts",
        position: "Senior Nurse",
        relationship: "Supervisor",
        contactNumber: "+44 7700 900789",
        email: "michael.roberts@carehome.co.uk",
      },
    ],

    trainingCourses: [
      {
        courseTitle: "Safeguarding Adults Level 3",
        trainingProvider: "Health Training UK",
        duration: "2 Days",
        completionDate: "2024-03-12",
      },
      {
        courseTitle: "Medication Administration",
        trainingProvider: "Care Skills Academy",
        duration: "1 Day",
        completionDate: "2024-06-20",
      },
    ],

    employmentHistory: [
      {
        employerName: "Sunrise Care Home",
        address: "45 Park Lane, Manchester",
        typeOfBusiness: "Residential Care",
        jobTitle: "Support Worker",
        phone: "+44 161 123 4567",
        startDate: "2021-01-15",
        endDate: "2023-08-30",
        grade: "Band 3",
        salary: "£22,000",
        specialty: "Elderly Care",
        jobType: "Full-Time",
        reasonForLeaving: "Career progression",
        dutiesResponsibilities:
          "Provided personal care, assisted with medication, supported daily living activities and maintained care records.",
      },
      {
        employerName: "City Mental Health Trust",
        address: "12 Broad Street, Birmingham",
        typeOfBusiness: "Mental Health Services",
        jobTitle: "Healthcare Assistant",
        phone: "+44 121 987 6543",
        startDate: "2019-05-10",
        endDate: "2020-12-20",
        grade: "Band 2",
        salary: "£19,500",
        specialty: "Mental Health",
        jobType: "Full-Time",
        reasonForLeaving: "Relocation",
        dutiesResponsibilities:
          "Supported patients with mental health conditions, monitored wellbeing, documented observations and assisted clinical staff.",
      },
    ],

    mandatoryExperience: {
      experienceAreas: ["Mental Health", "Learning Disabilities", "Elderly"],
      definitionOfVulnerablePeople:
        "Individuals who may be at risk due to age, disability, illness or social circumstances and require additional support.",
      measuresToEnsureCare:
        "Following safeguarding procedures, regular risk assessments, clear communication and maintaining dignity and respect.",
      helpNonVerbalClient:
        "Use visual aids, body language cues and offer simple choices to support decision making.",
      actionIfWitnessAbuse:
        "Immediately report to safeguarding lead and follow organisational reporting procedures.",
    },

    supportingStatement: {
      statement:
        "I am applying for this role because I am passionate about providing high-quality care to vulnerable individuals. My previous experience in mental health and elderly care has equipped me with the skills required to deliver safe and compassionate support.",
    },

    declaration: {
      confirmed: true,
      signature: "Daniel Ahmed",
      date: "2026-02-27",
    },
  },
  {
    id: 3,
    personalInformation: {
      fullName: "Damon Salvetor",
      email: "daniel.ahmed@example.com",
      phoneNumber: "+44 7700 900123",
      currentAddress: "12 Greenfield Road, Birmingham",
      postcode: "B15 2TT",
      nationality: "British",
      immigrationStatus: "British Citizen",
      immigrationExpiryDate: null,
      needsUkWorkPermit: false,
      changedNameBefore: true,
      previousName: "Daniel Khan",
      changedTo: "Daniel Ahmed",
    },

    preQualifying: {
      limitedAvailabilityActivity: false,
      workRestrictions: true,
      restrictionDetails:
        "Non-compete agreement with previous employer (expires March 2026)",
      willingOvertime: true,
      unavailableHours: "Sunday mornings",
      noticePeriod: "4 weeks",
      workedBefore: false,
      appliedBefore: true,
      appliedDetails: "Applied in 2023 for Support Worker role",
    },

    criminalCompliance: {
      anyConvictions: false,
      convictionDetails: "",
      anyUnspentConvictions: false,
      unspentDetails: "",
      fitnessToPracticeInvestigation: false,
      removedFromRegister: false,
      dbsNumber: "DBS123456789",
      dbsExpiryDate: "2027-06-15",
    },

    healthInformation: {
      absentDaysLast3Years: 5,
      absencePeriodsLast3Years: 2,
      takingMedication: true,
      medicationDetails: "Seasonal allergy medication",
      healthTreatment: false,
      treatmentDetails: "",
      medicalConditionAffectingDuties: false,
      medicalConditionDetails: "",
      considerDisabled: false,
      impairmentType: "",
      fitForNightShift: true,
    },

    professionalRegistration: {
      professionalBodyName: "NMC",
      registrationType: "Registered Nurse",
      pinNumber: "12A3456B",
      expiryDate: "2026-11-30",
    },

    references: [
      {
        referenceName: "Sarah Thompson",
        position: "Clinical Manager",
        relationship: "Line Manager",
        contactNumber: "+44 7700 900456",
        email: "sarah.thompson@healthcare.org",
      },
      {
        referenceName: "Michael Roberts",
        position: "Senior Nurse",
        relationship: "Supervisor",
        contactNumber: "+44 7700 900789",
        email: "michael.roberts@carehome.co.uk",
      },
    ],

    trainingCourses: [
      {
        courseTitle: "Safeguarding Adults Level 3",
        trainingProvider: "Health Training UK",
        duration: "2 Days",
        completionDate: "2024-03-12",
      },
      {
        courseTitle: "Medication Administration",
        trainingProvider: "Care Skills Academy",
        duration: "1 Day",
        completionDate: "2024-06-20",
      },
    ],

    employmentHistory: [
      {
        employerName: "Sunrise Care Home",
        address: "45 Park Lane, Manchester",
        typeOfBusiness: "Residential Care",
        jobTitle: "Support Worker",
        phone: "+44 161 123 4567",
        startDate: "2021-01-15",
        endDate: "2023-08-30",
        grade: "Band 3",
        salary: "£22,000",
        specialty: "Elderly Care",
        jobType: "Full-Time",
        reasonForLeaving: "Career progression",
        dutiesResponsibilities:
          "Provided personal care, assisted with medication, supported daily living activities and maintained care records.",
      },
      {
        employerName: "City Mental Health Trust",
        address: "12 Broad Street, Birmingham",
        typeOfBusiness: "Mental Health Services",
        jobTitle: "Healthcare Assistant",
        phone: "+44 121 987 6543",
        startDate: "2019-05-10",
        endDate: "2020-12-20",
        grade: "Band 2",
        salary: "£19,500",
        specialty: "Mental Health",
        jobType: "Full-Time",
        reasonForLeaving: "Relocation",
        dutiesResponsibilities:
          "Supported patients with mental health conditions, monitored wellbeing, documented observations and assisted clinical staff.",
      },
    ],

    mandatoryExperience: {
      experienceAreas: ["Mental Health", "Learning Disabilities", "Elderly"],
      definitionOfVulnerablePeople:
        "Individuals who may be at risk due to age, disability, illness or social circumstances and require additional support.",
      measuresToEnsureCare:
        "Following safeguarding procedures, regular risk assessments, clear communication and maintaining dignity and respect.",
      helpNonVerbalClient:
        "Use visual aids, body language cues and offer simple choices to support decision making.",
      actionIfWitnessAbuse:
        "Immediately report to safeguarding lead and follow organisational reporting procedures.",
    },

    supportingStatement: {
      statement:
        "I am applying for this role because I am passionate about providing high-quality care to vulnerable individuals. My previous experience in mental health and elderly care has equipped me with the skills required to deliver safe and compassionate support.",
    },

    declaration: {
      confirmed: true,
      signature: "Daniel Ahmed",
      date: "2026-02-27",
    },
  },
];

export default function UserDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const user = data.find((u) => u.id === id);

  if (!user) {
    return <div className="p-6 text-red-500 font-semibold">User not found</div>;
  }

  const {
    personalInformation,
    preQualifying,
    criminalCompliance,
    healthInformation,
    professionalRegistration,
    references,
    trainingCourses,
    employmentHistory,
    mandatoryExperience,
    supportingStatement,
    declaration,
  } = user;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-primary">
          {personalInformation.fullName}
        </h1>
        <p className="text-gray-500">{personalInformation.email}</p>
      </div>

      {/* SECTION 1 - Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-4 text-sm">
          <Info label="Full Name" value={personalInformation.fullName} />
          <Info label="Email" value={personalInformation.email} />
          <Info label="Phone" value={personalInformation.phoneNumber} />
          <Info label="Address" value={personalInformation.currentAddress} />
          <Info label="Postcode" value={personalInformation.postcode} />
          <Info label="Nationality" value={personalInformation.nationality} />
          <Info
            label="Immigration Status"
            value={personalInformation.immigrationStatus}
          />
          <Info
            label="Immigration Expiry Date"
            value={personalInformation.immigrationExpiryDate}
          />
          <Info
            label="Needs UK Permit"
            value={personalInformation.needsUkWorkPermit ? "Yes" : "No"}
          />
          <Info
            label="Changed Name Before"
            value={personalInformation.changedNameBefore ? "Yes" : "No"}
          />
          {personalInformation.changedNameBefore && (
            <>
              <Info
                label="Previous Name"
                value={personalInformation.previousName}
              />
              <Info label="Changed to" value={personalInformation.changedTo} />
            </>
          )}
        </CardContent>
      </Card>
      {/* SECTION 2 - Pre Qualifying */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Pre-Qualifying</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
          <Info
            label="Limited Availability Activity"
            value={preQualifying.limitedAvailabilityActivity ? "Yes" : "No"}
          />
          <Info
            label="Work Restrictions"
            value={preQualifying.workRestrictions ? "Yes" : "No"}
          />
          {preQualifying.workRestrictions && (
            <Info
              label="Restriction Details"
              value={preQualifying.restrictionDetails}
            />
          )}

          <Info
            label="Willing Overtime"
            value={preQualifying.willingOvertime ? "Yes" : "No"}
          />
          <Info
            label="Unavailable Hours"
            value={preQualifying.unavailableHours}
          />
          <Info label="Notice Period" value={preQualifying.noticePeriod} />
          <Info
            label="Work Restrictions"
            value={preQualifying.workRestrictions ? "Yes" : "No"}
          />
          <Info
            label="Applied Before"
            value={preQualifying.appliedBefore ? "Yes" : "No"}
          />
          <Info label="Applied Details" value={preQualifying.appliedDetails} />
        </CardContent>
      </Card>

      {/* SECTION 3 - Criminal Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Criminal & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
          <Info
            label="Any Convictions"
            value={criminalCompliance.anyConvictions ? "Yes" : "No"}
          />
          {criminalCompliance.anyConvictions && (
            <Info
              label="Conviction Details"
              value={criminalCompliance.convictionDetails}
            />
          )}
          <Info
            label="Any Unspent Convictions"
            value={criminalCompliance.anyUnspentConvictions ? "Yes" : "No"}
          />
          {criminalCompliance.anyUnspentConvictions && (
            <Info
              label="Unspent Details"
              value={criminalCompliance.unspentDetails}
            />
          )}
          <Info
            label="Fitness To Practice Investigation"
            value={
              criminalCompliance.fitnessToPracticeInvestigation ? "Yes" : "No"
            }
          />
          <Info
            label="Removed From Register"
            value={criminalCompliance.removedFromRegister ? "Yes" : "No"}
          />

          <Info label="DBS Expiry" value={criminalCompliance.dbsExpiryDate} />
          <Info label="DBS Number" value={criminalCompliance.dbsNumber} />
        </CardContent>
      </Card>

      {/* SECTION 4 - Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Health Information</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
          <Info
            label="Absent Days (Last 3 Years)"
            value={healthInformation.absentDaysLast3Years}
          />

          <Info
            label="Absence Periods (Last 3 Years)"
            value={healthInformation.absencePeriodsLast3Years}
          />

          <Info
            label="Currently Taking Medication"
            value={healthInformation.takingMedication ? "Yes" : "No"}
          />

          {healthInformation.takingMedication && (
            <Info
              label="Medication Details"
              value={healthInformation.medicationDetails}
            />
          )}

          <Info
            label="Physical or Mental Health Treatment"
            value={healthInformation.healthTreatment ? "Yes" : "No"}
          />

          {healthInformation.healthTreatment && (
            <Info
              label="Treatment Details"
              value={healthInformation.treatmentDetails}
            />
          )}

          <Info
            label="Medical Condition Affecting Duties"
            value={
              healthInformation.medicalConditionAffectingDuties ? "Yes" : "No"
            }
          />

          {healthInformation.medicalConditionAffectingDuties && (
            <Info
              label="Medical Condition Details"
              value={healthInformation.medicalConditionDetails}
            />
          )}

          <Info
            label="Consider Yourself Disabled"
            value={healthInformation.considerDisabled ? "Yes" : "No"}
          />

          {healthInformation.considerDisabled && (
            <Info
              label="Type of Impairment"
              value={healthInformation.impairmentType}
            />
          )}

          <Info
            label="Fit for Night Shift (18:00–07:00)"
            value={healthInformation.fitForNightShift ? "Yes" : "No"}
          />
        </CardContent>
      </Card>

      {/* SECTION 5 - Professional Registration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Professional Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
          <Info
            label="Body"
            value={professionalRegistration.professionalBodyName}
          />
          <Info
            label="Type"
            value={professionalRegistration.registrationType}
          />
          <Info label="PIN" value={professionalRegistration.pinNumber} />
          <Info label="Expiry" value={professionalRegistration.expiryDate} />
        </CardContent>
      </Card>

      {/* SECTION 6 - References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">References</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {references.map((ref, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm"
            >
              <Info label="Reference Name" value={ref.referenceName} />

              <Info label="Position" value={ref.position} />

              <Info label="Relationship" value={ref.relationship} />

              <Info label="Contact Number" value={ref.contactNumber} />

              <Info label="Email Address" value={ref.email} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 7 - Training & Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Training & Courses</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {trainingCourses.map((course, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm"
            >
              <Info label="Course Title" value={course.courseTitle} />

              <Info label="Training Provider" value={course.trainingProvider} />

              <Info label="Duration" value={course.duration} />

              <Info label="Completion Date" value={course.completionDate} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 8 - Employment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Employment History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {employmentHistory.map((job, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6">
              {/* Optional Heading */}
              <h3 className="text-lg font-semibold text-primary">
                Employment {index + 1}
              </h3>

              {/* Grid Information */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                <Info label="Employer Name" value={job.employerName} />

                <Info label="Address" value={job.address} />

                <Info label="Type of Business" value={job.typeOfBusiness} />

                <Info label="Job Title" value={job.jobTitle} />

                <Info label="Phone Number" value={job.phone} />

                <Info label="Start Date" value={job.startDate} />

                <Info label="End Date" value={job.endDate} />

                <Info label="Grade" value={job.grade} />

                <Info label="Salary" value={job.salary} />

                <Info label="Specialty" value={job.specialty} />

                <Info label="Job Type" value={job.jobType} />

                <Info label="Reason for Leaving" value={job.reasonForLeaving} />
                <div className="col-span-2">
                  <Info
                    label="Duties & Responsibilities"
                    value={job.dutiesResponsibilities}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 9 - Mandatory Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Mandatory Experience</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-sm">
          {/* Experience Areas */}
          <div>
            <p className="font-semibold text-xs mb-2">Experience Areas</p>

            <div>
              {mandatoryExperience.experienceAreas.map((area, index) => (
                <Badge key={index} className="mr-2 mb-2 bg-primary text-white">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Question & Answer Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-xs">
                Definition of Vulnerable People
              </p>
              <p className="text-gray-500  font-medium mt-1">
                {mandatoryExperience.definitionOfVulnerablePeople}
              </p>
            </div>

            <div>
              <p className="font-semibold text-xs">
                Measures to Ensure Proper Care
              </p>
              <p className="text-gray-500  font-medium mt-1">
                {mandatoryExperience.measuresToEnsureCare}
              </p>
            </div>

            <div>
              <p className="font-semibold text-xs">
                Helping a Non-Verbal Client Make Choices
              </p>
              <p className="text-gray-500  font-medium mt-1">
                {mandatoryExperience.helpNonVerbalClient}
              </p>
            </div>

            <div>
              <p className="font-semibold text-xs">
                Action if Witnessing Abuse
              </p>
              <p className="text-gray-500  font-medium mt-1">
                {mandatoryExperience.actionIfWitnessAbuse}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 10 - Supporting Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Supporting Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{supportingStatement.statement}</p>
        </CardContent>
      </Card>

      {/* SECTION 11 - Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Declaration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-4 grid grid-cols-2 md:grid-cols-3 ">
          <Info
            label="Confirmed"
            value={declaration.confirmed ? "Yes" : "No"}
          />
          <Info label="Signature" value={declaration.signature} />
          <Info label="Date" value={declaration.date} />
        </CardContent>
      </Card>
    </div>
  );
}

/* Small reusable component */
function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="font-semibold text-gray-700  text-xs">{label}:</p>
      <p className="text-gray-500 font-medium">{value || "-"}</p>
    </div>
  );
}
