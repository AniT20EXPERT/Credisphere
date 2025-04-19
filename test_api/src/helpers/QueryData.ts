import mongoose from 'mongoose';
import { BureauAlpha, BureauBeta, BureauGamma, IBureauAlpha, IBureauBeta, IBureauGamma } from './Schema'; // Import your models
import { initializeDatabase } from './Connect';

// Define the type for the result
type QueryResult = {
  value: any;
  bureau: string;
  field: string;
};

export async function QueryData(API: number, phone: string | number): Promise<QueryResult> {
  // Convert phone to string if it's a number
  const phoneStr = phone.toString();
  
  // Map API to corresponding Bureau and field
  const config: Record<number, { bureau: string; field: string }> = {
    1: { bureau: "Alpha", field: "credit" },
    2: { bureau: "Alpha", field: "employment" },
    3: { bureau: "Alpha", field: "payment_history" },
    4: { bureau: "Alpha", field: "credit_utilization" },
    5: { bureau: "Alpha", field: "dti_ratio" },
    6: { bureau: "Beta", field: "credit" },
    7: { bureau: "Beta", field: "employment" },
    8: { bureau: "Beta", field: "payment_history" },
    9: { bureau: "Beta", field: "credit_utilization" },
    10: { bureau: "Beta", field: "dti_ratio" },
    11: { bureau: "Gamma", field: "credit" },
    12: { bureau: "Gamma", field: "employment" },
    13: { bureau: "Gamma", field: "payment_history" },
    14: { bureau: "Gamma", field: "credit_utilization" },
    15: { bureau: "Gamma", field: "dti_ratio" },
  };

  // Access config using API
  const { bureau, field } = config[API];
  if (bureau && field) {
    return queryDatabase(bureau, phoneStr, field);
  } else {
    throw new Error(`Invalid API: ${API}`);
  }
}

async function queryDatabase(
  bureau: string,
  phone: string,
  field: string
): Promise<QueryResult> {
  await initializeDatabase();
  console.log(`Querying ${bureau} for phone ${phone}, field ${field}`);
  
  // Map to the correct model
  let model: any;
  switch (bureau) {
    case "Alpha":
      model = BureauAlpha;
      break;
    case "Beta":
      model = BureauBeta;
      break;
    case "Gamma":
      model = BureauGamma;
      break;
    default:
      throw new Error(`Invalid bureau: ${bureau}`);
  }

  // Query the database
  const result = await model.findOne({ phone });
  console.log(result)
  
  if (!result) {
    throw new Error(`Phone number ${phone} not found in Bureau${bureau}`);
  }

  // Fix: Use type assertion to access the field
  const value = field in result ? (result as any)[field] : undefined;
  
  return {
    value,
    bureau,
    field
  };
}