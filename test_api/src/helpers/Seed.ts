import mongoose from 'mongoose';
import { BureauAlpha, BureauBeta, BureauGamma } from './Schema';
import { connectToDatabase, disconnectFromDatabase } from './Connect';

// Generate a random phone number (10 digits)
function generatePhone(): string {
  return Array(10).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
}

// Generate seed data with hardcoded values
async function generateSeedData() {
  try {
    console.log('Starting to generate hardcoded seed data...');
    
    // Connect to database
    await connectToDatabase();
    
    // Clear existing data
    await Promise.all([
      BureauAlpha.deleteMany({}),
      BureauBeta.deleteMany({}),
      BureauGamma.deleteMany({})
    ]);
    console.log('Cleared existing data');
    
    // Hardcoded datasets
    // High risk data
    const highRiskData = {
      'bureau': ['A', 'B', 'C'],
      'credit_score': [400, 100, 15],  // Different scales
      'score_range_min': [300, 1, 0],
      'score_range_max': [850, 1000, 100],
      'payment_history': ['Fair', 'Fair', 'Poor'],
      'credit_utilization': [15, 11, 15],
      'debt_to_income_ratio': [1.6, 1.5, 1.6],
      'employment_stat': ['Unemployed', 'Unemployed', 'Part-Time']
    };

    // Medium risk data
    const mediumRiskData = {
      'bureau': ['A', 'B', 'C'],
      'credit_score': [800, 900, 90],  // Different scales
      'score_range_min': [300, 1, 0],
      'score_range_max': [850, 1000, 100],
      'payment_history': ['Good', 'Excellent', 'Excellent'],
      'credit_utilization': [35, 45, 55],
      'debt_to_income_ratio': [0.6, 0.5, 0.6],
      'employment_stat': ['Full-Time', 'Full-Time', 'Self-Employed']
    };
    
    // Low risk data (new dataset)
    const lowRiskData = {
      'bureau': ['A', 'B', 'C'],
      'credit_score': [800, 0, 92],
      'score_range_min': [300, 1, 0],
      'score_range_max': [850, 1000, 100],
      'payment_history': ['Very Good', 0, 'Fair'],
      'credit_utilization': [35, 0, 55],
      'debt_to_income_ratio': [0.6, 0.5, 0],
      'employment_stat': [0, 'Full-Time', 'Part-Time']
    };
    
    // Generate names and phones - each dataset gets a unique phone number
    const names = ['John Doe', 'Jane Smith', 'Alex Johnson'];
    const phones = [generatePhone(), generatePhone(), generatePhone()];
    
    console.log('Generated phone numbers:');
    console.log('High Risk:', phones[0]);
    console.log('Medium Risk:', phones[1]);
    console.log('Low Risk:', phones[2]);
    
    // Create documents for each bureau
    const alphaData = [];
    const betaData = [];
    const gammaData = [];
    
    console.log('Generating records...');
    
    // Create documents from highRiskData
    for (let i = 0; i < highRiskData.bureau.length; i++) {
      const bureau = highRiskData.bureau[i];
      
      const record = {
        name: names[0],
        phone: phones[0],
        credit: highRiskData.credit_score[i],
        employment: highRiskData.employment_stat[i],
        payment_history: highRiskData.payment_history[i],
        credit_utilization: highRiskData.credit_utilization[i],
        score_range_min: highRiskData.score_range_min[i],
        score_range_max: highRiskData.score_range_max[i],
        dti_ratio: highRiskData.debt_to_income_ratio[i],
        bureau: bureau === 'A' ? 'Alpha' : bureau === 'B' ? 'Beta' : 'Gamma',
        last_updated: new Date()
      };
      
      if (bureau === 'A') alphaData.push(record);
      else if (bureau === 'B') betaData.push(record);
      else if (bureau === 'C') gammaData.push(record);
    }
    
    // Create documents from mediumRiskData
    for (let i = 0; i < mediumRiskData.bureau.length; i++) {
      const bureau = mediumRiskData.bureau[i];
      
      const record = {
        name: names[1],
        phone: phones[1],
        credit: mediumRiskData.credit_score[i],
        employment: mediumRiskData.employment_stat[i],
        payment_history: mediumRiskData.payment_history[i],
        credit_utilization: mediumRiskData.credit_utilization[i],
        score_range_min: mediumRiskData.score_range_min[i],
        score_range_max: mediumRiskData.score_range_max[i],
        dti_ratio: mediumRiskData.debt_to_income_ratio[i],
        bureau: bureau === 'A' ? 'Alpha' : bureau === 'B' ? 'Beta' : 'Gamma',
        last_updated: new Date()
      };
      
      if (bureau === 'A') alphaData.push(record);
      else if (bureau === 'B') betaData.push(record);
      else if (bureau === 'C') gammaData.push(record);
    }
    
    // Create documents from lowRiskData (new)
    for (let i = 0; i < lowRiskData.bureau.length; i++) {
      const bureau = lowRiskData.bureau[i];
      
      const record = {
        name: names[2],
        phone: phones[2],
        credit: lowRiskData.credit_score[i],
        employment: lowRiskData.employment_stat[i] === 0 ? 'Unknown' : lowRiskData.employment_stat[i],
        payment_history: lowRiskData.payment_history[i] === 0 ? 'Unknown' : lowRiskData.payment_history[i],
        credit_utilization: lowRiskData.credit_utilization[i],
        score_range_min: lowRiskData.score_range_min[i],
        score_range_max: lowRiskData.score_range_max[i],
        dti_ratio: lowRiskData.debt_to_income_ratio[i],
        bureau: bureau === 'A' ? 'Alpha' : bureau === 'B' ? 'Beta' : 'Gamma',
        last_updated: new Date()
      };
      
      if (bureau === 'A') alphaData.push(record);
      else if (bureau === 'B') betaData.push(record);
      else if (bureau === 'C') gammaData.push(record);
    }
    
    // Insert all records
    console.log('Inserting records into database...');
    
    // Insert records one by one with better error handling
    for (const record of alphaData) {
      try {
        await BureauAlpha.create(record);
        console.log(`Successfully inserted Alpha record for ${record.name}`);
      } catch (error) {
        console.error(`Error inserting Alpha record for ${record.name}:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    for (const record of betaData) {
      try {
        await BureauBeta.create(record);
        console.log(`Successfully inserted Beta record for ${record.name}`);
      } catch (error) {
        console.error(`Error inserting Beta record for ${record.name}:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    for (const record of gammaData) {
      try {
        await BureauGamma.create(record);
        console.log(`Successfully inserted Gamma record for ${record.name}`);
      } catch (error) {
        console.error(`Error inserting Gamma record for ${record.name}:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    // Log a sample from each risk category
    const highRiskSample = await BureauAlpha.findOne({ phone: phones[0] }).lean();
    const mediumRiskSample = await BureauAlpha.findOne({ phone: phones[1] }).lean();
    const lowRiskSample = await BureauAlpha.findOne({ phone: phones[2] }).lean();
    
    console.log('High Risk Sample:', JSON.stringify(highRiskSample, null, 2));
    console.log('Medium Risk Sample:', JSON.stringify(mediumRiskSample, null, 2));
    console.log('Low Risk Sample:', JSON.stringify(lowRiskSample, null, 2));
    
    // Disconnect from database
    await disconnectFromDatabase();
    console.log('Seed data generation complete!');
    
  } catch (error) {
    console.error('Error generating seed data:', error instanceof Error ? error.message : String(error));
  } finally {
    // Ensure disconnection in case of error
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore disconnection errors
    }
  }
}

// Run the seed function
generateSeedData();