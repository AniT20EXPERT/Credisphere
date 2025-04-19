import mongoose, { Document, Schema } from 'mongoose';

// Base interface with common fields
interface IBureauBase extends Document {
  bureau: 'Alpha' | 'Beta' | 'Gamma';
  phone: string;
  last_updated: Date;
}

// BureauAlpha interface
export interface IBureauAlpha extends IBureauBase {
  credit: number; // Scale: 300-850
  score_range_min: number; // 300
  score_range_max: number; // 850
  payment_history?: string;
  credit_utilization?: number;
  dti_ratio?: number;
  employment?: string;
}

// BureauBeta interface
export interface IBureauBeta extends IBureauBase {
  credit: number; // Scale: 1-1000
  score_range_min: number; // 1
  score_range_max: number; // 1000
  payment_history?: string;
  credit_utilization?: number;
  dti_ratio?: number;
  employment?: string;
}

// BureauGamma interface
export interface IBureauGamma extends IBureauBase {
  credit: number; // Scale: 0-100
  score_range_min: number; // 0
  score_range_max: number; // 100
  payment_history?: string;
  credit_utilization?: number;
  dti_ratio?: number;
  employment?: string;
}

// Base schema with common fields
const bureauBaseSchema: Record<string, any> = {
  bureau: {
    type: String,
    enum: ['Alpha', 'Beta', 'Gamma'],
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ensure phone numbers are unique
    // index: true,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
};

// BureauAlpha Schema
const bureauAlphaSchema = new Schema<IBureauAlpha>({
  ...bureauBaseSchema,
  credit: {
    type: Number,
    required: true,
    min: 300,
    max: 850,
  },
  score_range_min: {
    type: Number,
    required: true,
    default: 300,
  },
  score_range_max: {
    type: Number,
    required: true,
    default: 850,
  },
  payment_history: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
  },
  credit_utilization: {
    type: Number,
    min: 0,
    max: 100,
  },
  dti_ratio: {
    type: Number,
    min: 0,
  },
  employment: {
    type: String
  }
});

// BureauBeta Schema
const bureauBetaSchema = new Schema<IBureauBeta>({
  ...bureauBaseSchema,
  credit: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
  },
  score_range_min: {
    type: Number,
    required: true,
    default: 1,
  },
  score_range_max: {
    type: Number,
    required: true,
    default: 1000,
  },
  payment_history: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
  },
  credit_utilization: {
    type: Number,
    min: 0,
    max: 100,
  },
  dti_ratio: {
    type: Number,
    min: 0,
  },
  employment: {
    type: String
  }
});

// BureauGamma Schema
const bureauGammaSchema = new Schema<IBureauGamma>({
  ...bureauBaseSchema,
  credit: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  score_range_min: {
    type: Number,
    required: true,
    default: 0,
  },
  score_range_max: {
    type: Number,
    required: true,
    default: 100,
  },
  payment_history: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
  },
  credit_utilization: {
    type: Number,
    min: 0,
    max: 100,
  },
  dti_ratio: {
    type: Number,
    min: 0,
  },
  employment: {
    type: String
  }
});

// // Create indexes for efficient querying
// bureauAlphaSchema.index({ phone: 1 });
// bureauBetaSchema.index({ phone: 1 });
// bureauGammaSchema.index({ phone: 1 });
// bureauAlphaSchema.index({ bureau: 1 });
// bureauBetaSchema.index({ bureau: 1 });
// bureauGammaSchema.index({ bureau: 1 });

// Models
export const BureauAlpha = mongoose.model<IBureauAlpha>('BureauAlpha', bureauAlphaSchema);
export const BureauBeta = mongoose.model<IBureauBeta>('BureauBeta', bureauBetaSchema);
export const BureauGamma = mongoose.model<IBureauGamma>('BureauGamma', bureauGammaSchema);
