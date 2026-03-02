"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

const data = [
  {
    id:1,
    personalInformation: {
      fullName: "Daniel Ahmed",
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
    id:2,
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
    id:3,
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

export default function UsersTable() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-primary text-3xl">Compliance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-gray-600">Name</TableHead>
                <TableHead className="text-gray-600">Email</TableHead>
                <TableHead className="text-gray-600">Phone</TableHead>
                <TableHead className="text-gray-600">Nationality</TableHead>
                <TableHead className="text-gray-600">Created At</TableHead>
                <TableHead className="text-gray-600 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((user, index) => (
                <TableRow
                  key={index}
                  className="border-slate-200 hover:bg-gray-50 transition"
                >
                  <TableCell className="font-medium text-gray-800 ">
                    {user.personalInformation.fullName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.personalInformation.email}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.personalInformation.phoneNumber}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.personalInformation.nationality}{" "}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {user.declaration.date}
                  </TableCell>
                  {/* ✅ Actions Column */}
                  <TableCell className="text-center">
                    <ActionsMenu id={user.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

const ActionsMenu = ({ id }: { id: number }) => {
  const router = useRouter();
  const handleView = () => {
    router.push(`/admin/compliance/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};