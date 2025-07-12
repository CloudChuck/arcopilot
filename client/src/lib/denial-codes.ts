export interface DenialCodeMapping {
  code: string;
  description: string;
  questions: string[];
  requiredFields: string[];
  nextSteps: string[];
}

export const denialCodeMappings: Record<string, DenialCodeMapping> = {
  "CO-27": {
    code: "CO-27",
    description: "Expenses incurred after coverage terminated",
    questions: [
      "What was the patient's eligibility status on the date of service?",
      "Was the plan active on the date of service?",
      "What is the effective and termination date of coverage?",
      "Is there any possibility of retroactive coverage?"
    ],
    requiredFields: ["eligibilityStatus", "eligibilityFromDate", "dateOfService", "repName"],
    nextSteps: [
      "Document termination date in patient record",
      "Generate final comment for RCM system",
      "Mark account for patient notification"
    ]
  },
  "CO-97": {
    code: "CO-97",
    description: "The benefit for this service is included in the payment/allowance for another service/procedure",
    questions: [
      "Which primary service was this bundled with?",
      "Was the bundled service paid correctly?",
      "Is there documentation showing separate services?",
      "What is the bundling policy for this procedure?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review bundling documentation",
      "Verify primary service payment status",
      "Document bundling rationale"
    ]
  },
  "PR-204": {
    code: "PR-204",
    description: "This service/equipment/drug is not covered under the patient's current benefit plan",
    questions: [
      "Is prior authorization required for this service?",
      "What is the patient's current benefit plan?",
      "Are there any covered alternatives?",
      "Is this service excluded from the plan?"
    ],
    requiredFields: ["eligibilityStatus", "dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review benefit plan documentation",
      "Check for prior authorization requirements",
      "Notify patient of coverage limitations"
    ]
  },
  "CO-50": {
    code: "CO-50",
    description: "These are non-covered services because this is not deemed a 'medical necessity'",
    questions: [
      "What criteria was used to determine medical necessity?",
      "Is there additional documentation that supports necessity?",
      "Was a peer-to-peer review conducted?",
      "Are there appeal options available?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Gather additional medical documentation",
      "Consider peer-to-peer review",
      "Prepare appeal if warranted"
    ]
  },
  "CO-16": {
    code: "CO-16",
    description: "Claim/service lacks information or has submission/billing error(s)",
    questions: [
      "What specific information is missing?",
      "What type of billing error was identified?",
      "Can the claim be corrected and resubmitted?",
      "What documentation is needed for resubmission?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Identify missing information",
      "Correct billing errors",
      "Prepare for claim resubmission"
    ]
  }
};

export const insuranceOptions = [
  { value: "aetna", label: "Aetna" },
  { value: "uhc", label: "United Healthcare (UHC)" },
  { value: "cigna", label: "Cigna" },
  { value: "bcbs", label: "Blue Cross Blue Shield" },
  { value: "humana", label: "Humana" },
  { value: "anthem", label: "Anthem" },
  { value: "kaiser", label: "Kaiser Permanente" },
  { value: "molina", label: "Molina Healthcare" },
  { value: "centene", label: "Centene" },
  { value: "other", label: "Other" }
];

export const eligibilityStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
  { value: "pending", label: "Pending" },
  { value: "unknown", label: "Unknown" }
];

export function generateRCMComment(formData: any): string {
  const repName = formData.repName || "[Rep Name]";
  const insuranceName = getInsuranceLabel(formData.insuranceName) || "[Insurance]";
  const denialCode = formData.denialCode || "[Code]";
  const callReference = formData.callReference || "[Reference]";
  
  let specificComment = "";
  
  switch (formData.denialCode) {
    case "CO-27":
      specificComment = `Patient eligibility ${formData.eligibilityStatus || "status unknown"} as of ${formData.eligibilityFromDate || "[Date]"}. Plan not active on DOS ${formData.dateOfService || "[DOS]"}`;
      break;
    case "CO-97":
      specificComment = `Service bundled with primary procedure. ${formData.additionalNotes || "Additional details required"}`;
      break;
    case "PR-204":
      specificComment = `Service not covered under current benefit plan. ${formData.eligibilityStatus === "active" ? "Patient active but service excluded" : "Coverage verification required"}`;
      break;
    case "CO-50":
      specificComment = `Service denied for medical necessity. ${formData.additionalNotes || "Additional documentation required"}`;
      break;
    case "CO-16":
      specificComment = `Claim has submission/billing errors. ${formData.additionalNotes || "Correction and resubmission required"}`;
      break;
    default:
      specificComment = "Denial details documented per rep guidance";
  }
  
  return `Spoke with ${repName} from ${insuranceName} regarding denial ${denialCode}. ${specificComment}. Call ref #${callReference}.`;
}

function getInsuranceLabel(value: string): string {
  const option = insuranceOptions.find(opt => opt.value === value);
  return option ? option.label : value;
}
