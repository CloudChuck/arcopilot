export interface DenialCodeMapping {
  code: string;
  description: string;
  questions: string[];
  requiredFields: string[];
  nextSteps: string[];
}

export const denialCodeMappings: Record<string, DenialCodeMapping> = {
  "CO-4": {
    code: "CO-4",
    description: "The procedure code is inconsistent with the modifier used or a required modifier is missing",
    questions: [
      "Which modifier was used or is missing?",
      "Is the procedure code correct for the service provided?",
      "What documentation supports the modifier usage?",
      "Does the modifier match the diagnosis?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review modifier requirements",
      "Verify procedure code accuracy",
      "Prepare corrected claim for resubmission"
    ]
  },
  "CO-6": {
    code: "CO-6",
    description: "The procedure/revenue code is inconsistent with the patient's age",
    questions: [
      "What is the patient's age?",
      "Is the procedure code age-appropriate?",
      "Are there alternative procedure codes for this age group?",
      "Is there documentation supporting the service for this age?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Verify patient age in records",
      "Review age-appropriate procedure codes",
      "Submit corrected claim if necessary"
    ]
  },
  "CO-11": {
    code: "CO-11",
    description: "The diagnosis is inconsistent with the procedure",
    questions: [
      "What diagnosis codes were submitted?",
      "Do the diagnosis codes support the procedure?",
      "Is there a more appropriate diagnosis code?",
      "Is additional documentation needed to support the procedure?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review diagnosis and procedure code relationship",
      "Gather supporting medical documentation",
      "Consider alternative diagnosis codes"
    ]
  },
  "CO-15": {
    code: "CO-15",
    description: "The authorization number is missing, invalid, or does not apply to the billed services or provider",
    questions: [
      "Was prior authorization obtained?",
      "What is the authorization number and expiration date?",
      "Does the authorization cover the specific service?",
      "Is the authorization for the correct provider?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Verify authorization requirements",
      "Obtain valid authorization if needed",
      "Resubmit with correct authorization number"
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
  "CO-23": {
    code: "CO-23",
    description: "The impact of prior payer(s) adjudication including payments and/or adjustments",
    questions: [
      "What was the primary payer's payment amount?",
      "Were there any adjustments from the primary payer?",
      "What is the remaining patient responsibility?",
      "Should this be billed to secondary insurance?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review primary payer adjudication",
      "Calculate remaining balance",
      "Bill secondary payer if applicable"
    ]
  },
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
  "CO-31": {
    code: "CO-31",
    description: "Patient cannot be identified as our insured",
    questions: [
      "Is the member ID number correct?",
      "Has the patient's name changed recently?",
      "Is the date of birth accurate?",
      "Are there any aliases or alternate spellings?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Verify patient demographics",
      "Check for name changes or aliases",
      "Obtain updated insurance information"
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
  "CO-167": {
    code: "CO-167",
    description: "This (these) diagnosis(es) is (are) not covered",
    questions: [
      "Which specific diagnosis codes were denied?",
      "Are there alternative diagnosis codes that would be covered?",
      "Is there additional documentation to support the diagnosis?",
      "Does the plan have specific exclusions for this condition?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Review covered diagnosis list",
      "Consider alternative diagnosis codes",
      "Gather supporting documentation"
    ]
  },
  "CO-170": {
    code: "CO-170",
    description: "Payment is denied when performed/billed by this type of provider",
    questions: [
      "What type of provider performed the service?",
      "Is the provider credentialed for this service?",
      "Are there provider type restrictions for this procedure?",
      "Can the service be performed by a different provider type?"
    ],
    requiredFields: ["dateOfService", "repName", "additionalNotes"],
    nextSteps: [
      "Verify provider credentials",
      "Check service restrictions by provider type",
      "Consider referral to appropriate provider"
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
  }
};

export const insuranceOptions = [
  { value: "aetna", label: "Aetna" },
  { value: "amerigroup", label: "Amerigroup" },
  { value: "anthem", label: "Anthem" },
  { value: "bcbs", label: "Blue Cross Blue Shield" },
  { value: "centene", label: "Centene" },
  { value: "cigna", label: "Cigna" },
  { value: "coventry", label: "Coventry Health Care" },
  { value: "elevance", label: "Elevance Health" },
  { value: "healthnet", label: "Health Net" },
  { value: "humana", label: "Humana" },
  { value: "independence", label: "Independence Blue Cross" },
  { value: "kaiser", label: "Kaiser Permanente" },
  { value: "medicaid", label: "Medicaid" },
  { value: "medicare", label: "Medicare" },
  { value: "molina", label: "Molina Healthcare" },
  { value: "oscar", label: "Oscar Health" },
  { value: "tricare", label: "TRICARE" },
  { value: "uhc", label: "United Healthcare (UHC)" },
  { value: "wellcare", label: "WellCare" },
  { value: "other", label: "Other" }
].sort((a, b) => a.label.localeCompare(b.label));

export const eligibilityStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
  { value: "pending", label: "Pending" },
  { value: "unknown", label: "Unknown" }
];

// Helper function to analyze and parse Q&A format responses
function parseQAResponse(notes: string, denialCode: string): string {
  if (!notes || notes.trim().length === 0) return "";
  
  // Check if this looks like a Q&A response (contains common patterns)
  const qaPatterns = [
    /medicare/i, /mcr/i, /aetna/i, /no.*billed/i, /primary/i, /secondary/i,
    /1st/i, /2nd/i, /never.*billed/i, /cob/i, /coordination/i
  ];
  
  const hasQAFormat = qaPatterns.some(pattern => pattern.test(notes));
  
  if (hasQAFormat && denialCode === 'CO-22') {
    // Specifically handle CO-22 (COB) responses
    return parseCoordinationOfBenefitsResponse(notes);
  }
  
  // Fall back to general improvement
  return improveAdditionalNotes(notes);
}

// Specific parser for CO-22 (Coordination of Benefits) responses
function parseCoordinationOfBenefitsResponse(notes: string): string {
  const lowerNotes = notes.toLowerCase();
  
  // Extract insurance information
  const insuranceNames = [];
  if (lowerNotes.includes('medicare') || lowerNotes.includes('mcr')) {
    insuranceNames.push('Medicare');
  }
  if (lowerNotes.includes('aetna')) {
    insuranceNames.push('Aetna');
  }
  if (lowerNotes.includes('bcbs') || lowerNotes.includes('blue cross')) {
    insuranceNames.push('Blue Cross Blue Shield');
  }
  if (lowerNotes.includes('uhc') || lowerNotes.includes('united')) {
    insuranceNames.push('United Healthcare');
  }
  
  // Determine primary insurance
  let primaryInsurance = '';
  if (lowerNotes.includes('medicare') && (lowerNotes.includes('primary') || lowerNotes.includes('1st'))) {
    primaryInsurance = 'Medicare';
  } else if (insuranceNames.length > 0) {
    primaryInsurance = insuranceNames[0];
  }
  
  // Check if primary was billed first
  const primaryNotBilled = lowerNotes.includes('never billed') || 
                          lowerNotes.includes('not billed') || 
                          lowerNotes.includes('no prim');
  
  // Build intelligent response
  let response = '';
  
  if (insuranceNames.length > 1) {
    response = `Patient has ${insuranceNames.join(' and ')}. `;
  } else if (insuranceNames.length === 1) {
    response = `Patient has ${insuranceNames[0]}. `;
  }
  
  if (primaryInsurance) {
    response += `${primaryInsurance} should be primary`;
    if (primaryNotBilled) {
      response += ', but it was not billed first. ';
    } else {
      response += '. ';
    }
  }
  
  if (insuranceNames.length > 1) {
    const secondary = insuranceNames.find(name => name !== primaryInsurance);
    if (secondary) {
      response += `COB order is ${primaryInsurance} primary, then ${secondary} secondary.`;
    }
  }
  
  return response || improveAdditionalNotes(notes);
}

// Helper function to clean and improve additional notes
function improveAdditionalNotes(notes: string): string {
  if (!notes || notes.trim().length === 0) return "";
  
  // Common abbreviations and improvements
  const improvements = {
    'dup': 'duplicate',
    'prev': 'previous',
    'claiim': 'claim',
    'suibmit': 'submitted',
    'submited': 'submitted',
    'recieved': 'received',
    'payed': 'paid',
    'approvel': 'approval',
    'authorizaton': 'authorization',
    'necesary': 'necessary',
    'seperately': 'separately',
    'seperete': 'separate',
    'w/': 'with',
    'pt': 'patient',
    'dx': 'diagnosis',
    'proc': 'procedure',
    'auth': 'authorization',
    'pre-auth': 'pre-authorization',
    'reimb': 'reimbursement',
    'coord': 'coordination',
    'benefts': 'benefits',
    'eligibilty': 'eligibility',
    'mcr': 'Medicare',
    'prim': 'primary',
    'biled': 'billed'
  };
  
  let improved = notes.toLowerCase().trim();
  
  // Apply word improvements
  Object.entries(improvements).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    improved = improved.replace(regex, correct);
  });
  
  // Fix common patterns
  improved = improved
    .replace(/\bno\s+void\s+any\s+claim\b/gi, 'do not void any claims')
    .replace(/\byes\s+true\s+duplicate\b/gi, 'confirmed true duplicate')
    .replace(/\bother\s+claim\s*#\s*(\d+)/gi, 'other claim #$1')
    .replace(/\bsubmit\s+on\s+(\d{8})/gi, (match, date) => {
      // Convert DDMMYYYY to MM/DD/YYYY
      if (date.length === 8) {
        const day = date.substring(0, 2);
        const month = date.substring(2, 4);
        const year = date.substring(4, 8);
        return `submitted on ${month}/${day}/${year}`;
      }
      return match;
    })
    .replace(/\bpaid\s+out\b/gi, 'paid in full')
    .replace(/\s+/g, ' ') // Clean multiple spaces
    .trim();
  
  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  
  // Ensure it ends with proper punctuation
  if (!improved.match(/[.!?]$/)) {
    improved += '.';
  }
  
  return improved;
}

export function generateRCMComment(formData: any): string {
  const repName = formData.repName || "[Rep Name]";
  const insuranceName = getInsuranceLabel(formData.insuranceName) || "[Insurance]";
  const denialCode = formData.denialCode || "[Code]";
  const callReference = formData.callReference || "[Reference]";
  
  let specificComment = "";
  
  switch (formData.denialCode) {
    case "CO-4":
      specificComment = `Modifier issue identified. Procedure code requires correct modifier for reimbursement`;
      break;
    case "CO-6":
      specificComment = `Age-related procedure code issue. Service not appropriate for patient age`;
      break;
    case "CO-11":
      specificComment = `Diagnosis-procedure mismatch. Additional documentation required to support procedure`;
      break;
    case "CO-15":
      specificComment = `Authorization missing or invalid. Valid authorization required for reimbursement`;
      break;
    case "CO-16":
      specificComment = `Missing/incorrect information identified. Correction and resubmission required`;
      break;
    case "CO-18":
      specificComment = `Duplicate claim identified. Original claim already processed`;
      break;
    case "CO-22":
      specificComment = `COB issue - other payer primary. Primary insurance must be billed first`;
      break;
    case "CO-23":
      specificComment = `Prior payer adjudication affects payment. Review primary payer payment details`;
      break;
    case "CO-27":
      specificComment = `Eligibility ${formData.eligibilityStatus || "inactive"} as of ${formData.eligibilityFromDate || "[Date]"}. Coverage terminated prior to DOS. Patient responsibility confirmed`;
      break;
    case "CO-29":
      specificComment = `Timely filing deadline exceeded. Claim submitted beyond payer deadline`;
      break;
    case "CO-31":
      specificComment = `Patient identification issue. Member demographics require verification`;
      break;
    case "CO-45":
      specificComment = `Charge exceeds fee schedule. Payment adjusted to contracted rate`;
      break;
    case "CO-50":
      specificComment = `Medical necessity criteria not met per payer guidelines. Additional documentation required for appeal`;
      break;
    case "CO-96":
      specificComment = `Non-covered service per plan benefits. Plan exclusion applies`;
      break;
    case "CO-97":
      specificComment = `Service bundled with primary procedure per payer policy. No additional payment available`;
      break;
    case "CO-109":
      specificComment = `Wrong payer - claim must go to correct insurance carrier`;
      break;
    case "CO-151":
      specificComment = `Service frequency exceeds guidelines. Medical necessity required for additional units`;
      break;
    case "CO-167":
      specificComment = `Diagnosis not covered per plan benefits. Review covered diagnosis list`;
      break;
    case "CO-170":
      specificComment = `Provider type restriction. Service not covered when performed by this provider type`;
      break;
    case "PR-1":
      specificComment = `Patient deductible responsibility. Annual deductible not met`;
      break;
    case "PR-2":
      specificComment = `Patient coinsurance responsibility per plan benefits`;
      break;
    case "PR-3":
      specificComment = `Patient copay responsibility confirmed`;
      break;
    case "PR-204":
      specificComment = `Service not covered under current plan benefits. Plan exclusion confirmed`;
      break;
    default:
      specificComment = `Denial documented per rep guidance`;
  }
  
  // Use intelligent Q&A parsing for additional notes
  const improvedNotes = parseQAResponse(formData.additionalNotes, formData.denialCode);
  const additionalInfo = improvedNotes ? ` Additional notes: ${improvedNotes}` : "";
  
  return `Spoke with ${repName} from ${insuranceName} - ${denialCode}: ${specificComment}.${additionalInfo} Call ref #${callReference}`;
}

function getInsuranceLabel(value: string): string {
  const option = insuranceOptions.find(opt => opt.value === value);
  return option ? option.label : value;
}