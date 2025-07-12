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
  },
  "CO-18": {
    code: "CO-18",
    description: "Duplicate claim/service",
    questions: [
      "What is the original claim number or date of submission?",
      "Was the previous claim paid or processed?",
      "Is this a true duplicate or a resubmission?",
      "Should we void one of the claims?"
    ],
    requiredFields: ["dateOfService", "repName", "callReference"],
    nextSteps: [
      "Verify original claim status",
      "Determine appropriate action",
      "Process duplicate resolution"
    ]
  },
  "CO-22": {
    code: "CO-22",
    description: "This care may be covered by another payer per coordination of benefits",
    questions: [
      "What other insurance does the patient have?",
      "Which payer should be primary?",
      "Has the primary insurance been billed first?",
      "What is the coordination of benefits order?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Verify insurance coordination",
      "Bill primary payer first",
      "Update billing sequence"
    ]
  },
  "CO-29": {
    code: "CO-29",
    description: "The time limit for filing has expired",
    questions: [
      "What is the filing deadline for this payer?",
      "When was the service originally provided?",
      "Are there any exceptions or appeals available?",
      "Was there a delay in receiving necessary documentation?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Document filing timeline",
      "Check for appeal options",
      "Review timely filing policies"
    ]
  },
  "CO-45": {
    code: "CO-45",
    description: "Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangement",
    questions: [
      "What is the contracted rate for this service?",
      "Is this the correct procedure code?",
      "Are there any modifiers that should be applied?",
      "Is the provider in-network or out-of-network?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review fee schedule",
      "Verify procedure coding",
      "Check contract terms"
    ]
  },
  "CO-96": {
    code: "CO-96",
    description: "Non-covered charge(s). At least one Remark Code must be provided",
    questions: [
      "What specific remark codes were provided?",
      "Why is this service considered non-covered?",
      "Are there any covered alternatives?",
      "Is this a plan exclusion or limitation?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review remark codes",
      "Check plan benefits",
      "Explore alternatives"
    ]
  },
  "CO-109": {
    code: "CO-109",
    description: "Claim not covered by this payer/contractor. You must send the claim to the correct payer/contractor",
    questions: [
      "Which payer should receive this claim?",
      "What insurance information do we have on file?",
      "Has the patient's coverage changed?",
      "Do we need updated insurance cards?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Verify correct payer",
      "Update insurance information",
      "Resubmit to appropriate payer"
    ]
  },
  "CO-151": {
    code: "CO-151",
    description: "Payment adjusted because the payer deems the information submitted does not support this many/frequency of services",
    questions: [
      "What frequency limits apply to this service?",
      "How many units were billed versus allowed?",
      "Is there documentation supporting medical necessity?",
      "Are there any diagnosis codes that would support additional units?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review frequency guidelines",
      "Gather supporting documentation",
      "Consider appeal if warranted"
    ]
  },
  "PR-1": {
    code: "PR-1",
    description: "Deductible amount",
    questions: [
      "What is the patient's annual deductible?",
      "How much has been met this year?",
      "Is this in-network or out-of-network deductible?",
      "Should we bill the patient for this amount?"
    ],
    requiredFields: ["dateOfService", "repName", "eligibilityStatus"],
    nextSteps: [
      "Verify deductible information",
      "Calculate patient responsibility",
      "Generate patient statement"
    ]
  },
  "PR-2": {
    code: "PR-2",
    description: "Coinsurance amount",
    questions: [
      "What is the patient's coinsurance percentage?",
      "Is this based on allowed amount or billed charges?",
      "Are there any out-of-pocket maximums to consider?",
      "Should we collect this from the patient?"
    ],
    requiredFields: ["dateOfService", "repName", "eligibilityStatus"],
    nextSteps: [
      "Calculate coinsurance accurately",
      "Verify out-of-pocket limits",
      "Bill patient appropriately"
    ]
  },
  "PR-3": {
    code: "PR-3",
    description: "Copayment amount",
    questions: [
      "What is the standard copay for this type of service?",
      "Was the copay collected at time of service?",
      "Are there any copay exemptions for this patient?",
      "Should we pursue collection of outstanding copay?"
    ],
    requiredFields: ["dateOfService", "repName", "eligibilityStatus"],
    nextSteps: [
      "Verify copay requirements",
      "Check payment history",
      "Follow up on collections"
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
  const dos = formData.dateOfService || "[DOS]";
  const patientName = formData.patientName || "[Patient]";
  const accountNumber = formData.accountNumber || "[Account]";
  
  let specificComment = "";
  
  switch (formData.denialCode) {
    case "CO-27":
      specificComment = `Patient eligibility confirmed ${formData.eligibilityStatus || "status pending"} as of ${formData.eligibilityFromDate || "[Date]"}. Coverage terminated prior to DOS ${dos}. Advised patient responsible for charges`;
      break;
    case "CO-97":
      specificComment = `Service bundled with primary procedure per payer policy. Payment included in comprehensive service allowance. ${formData.additionalNotes ? "Notes: " + formData.additionalNotes : "No additional reimbursement available"}`;
      break;
    case "PR-204":
      specificComment = `Service not covered under current benefit plan limitations. ${formData.eligibilityStatus === "active" ? "Patient eligibility active but specific service excluded per plan benefits" : "Coverage verification required for service authorization"}`;
      break;
    case "CO-50":
      specificComment = `Service denied due to medical necessity criteria not met per payer guidelines. ${formData.additionalNotes ? "Documentation reviewed: " + formData.additionalNotes : "Additional clinical documentation may be required for appeal"}`;
      break;
    case "CO-16":
      specificComment = `Claim denied for missing/incorrect information. ${formData.additionalNotes ? "Specific issue: " + formData.additionalNotes : "Correction and resubmission required per payer specifications"}`;
      break;
    case "CO-18":
      specificComment = `Duplicate claim submission identified. Original claim processing confirmed. No additional payment due`;
      break;
    case "CO-22":
      specificComment = `Coordination of benefits issue - other payer responsible. ${formData.additionalNotes ? "COB details: " + formData.additionalNotes : "Primary payer verification required before resubmission"}`;
      break;
    case "CO-29":
      specificComment = `Timely filing deadline exceeded for DOS ${dos}. Claim submission deadline missed per payer policy`;
      break;
    case "CO-45":
      specificComment = `Charge exceeds contracted fee schedule allowance. Payment adjusted to contracted rate per provider agreement`;
      break;
    case "CO-96":
      specificComment = `Service determined non-covered per plan benefits. ${formData.additionalNotes ? "Remark codes: " + formData.additionalNotes : "Plan exclusion applies"}`;
      break;
    case "CO-109":
      specificComment = `Incorrect payer - claim must be submitted to appropriate insurance carrier. ${formData.additionalNotes ? "Correct payer info: " + formData.additionalNotes : "Insurance verification required"}`;
      break;
    case "CO-151":
      specificComment = `Service frequency/quantity exceeds payer guidelines. ${formData.additionalNotes ? "Frequency details: " + formData.additionalNotes : "Medical necessity documentation required for additional units"}`;
      break;
    case "PR-1":
      specificComment = `Patient deductible responsibility confirmed. ${formData.eligibilityStatus === "active" ? "Annual deductible not yet met" : "Coverage status pending verification"}`;
      break;
    case "PR-2":
      specificComment = `Patient coinsurance responsibility per plan benefits. ${formData.eligibilityStatus === "active" ? "Standard coinsurance rate applies" : "Benefit verification required"}`;
      break;
    case "PR-3":
      specificComment = `Patient copayment responsibility confirmed per plan requirements. Standard copay amount applies to service`;
      break;
    default:
      specificComment = `Denial reason documented per payer representative guidance. ${formData.additionalNotes ? "Additional notes: " + formData.additionalNotes : "Follow-up action required"}`;
  }
  
  const baseComment = `Spoke with ${repName} from ${insuranceName} regarding account ${accountNumber} (${patientName}) - denial code ${denialCode} for DOS ${dos}.`;
  
  return `${baseComment} ${specificComment} Call reference #${callReference}. ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}.`;
}

function getInsuranceLabel(value: string): string {
  const option = insuranceOptions.find(opt => opt.value === value);
  return option ? option.label : value;
}
