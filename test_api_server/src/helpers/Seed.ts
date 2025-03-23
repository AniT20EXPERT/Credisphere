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
    const dataset1 = {
      'bureau': ['A', 'B', 'C'],
      'credit_score': [400, 100, 15],  // Different scales
      'score_range_min': [300, 1, 0],
      'score_range_max': [850, 1000, 100],
      'payment_history': ['Fair', 'Fair', 'Poor'],
      'credit_utilization': [15, 11, 15],
      'debt_to_income_ratio': [1.6, 1.5, 1.6],
      'employment_stat': ['Unemployed', 'Unemployed', 'Part-Time']
    };

    const dataset2 = {
      'bureau': ['A', 'B', 'C'],
      'credit_score': [800, 900, 90],  // Different scales
      'score_range_min': [300, 1, 0],
      'score_range_max': [850, 1000, 100],
      'payment_history': ['Good', 'Excellent', 'Excellent'],
      'credit_utilization': [35, 45, 55],
      'debt_to_income_ratio': [0.6, 0.5, 0.6],
      'employment_stat': ['Full-Time', 'Full-Time', 'Self-Employed']
    };
    
    // Generate names and phones
    const names = ['John Doe', 'Jane Smith'];
    const phones = [generatePhone(), generatePhone()];
    
    // Create documents for each bureau
    const alphaData = [];
    const betaData = [];
    const gammaData = [];
    
    console.log('Generating records...');
    
    // Create documents from dataset1
    for (let i = 0; i < dataset1.bureau.length; i++) {
      const bureau = dataset1.bureau[i];
      
      const record = {
        name: names[0],
        phone: phones[0],
        credit: dataset1.credit_score[i],
        employment: dataset1.employment_stat[i],
        payment_history: dataset1.payment_history[i],
        credit_utilization: dataset1.credit_utilization[i],
        score_range_min: dataset1.score_range_min[i],
        score_range_max: dataset1.score_range_max[i],
        dti_ratio: dataset1.debt_to_income_ratio[i],
        bureau: bureau === 'A' ? 'Alpha' : bureau === 'B' ? 'Beta' : 'Gamma',
        last_updated: new Date()
      };
      
      if (bureau === 'A') alphaData.push(record);
      else if (bureau === 'B') betaData.push(record);
      else if (bureau === 'C') gammaData.push(record);
    }
    
    // Create documents from dataset2
    for (let i = 0; i < dataset2.bureau.length; i++) {
      const bureau = dataset2.bureau[i];
      
      const record = {
        name: names[1],
        phone: phones[1],
        credit: dataset2.credit_score[i],
        employment: dataset2.employment_stat[i],
        payment_history: dataset2.payment_history[i],
        credit_utilization: dataset2.credit_utilization[i],
        score_range_min: dataset2.score_range_min[i],
        score_range_max: dataset2.score_range_max[i],
        dti_ratio: dataset2.debt_to_income_ratio[i],
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
    
    // Log a sample record
    const sampleRecord = await BureauAlpha.findOne().lean();
    console.log('Sample record:', JSON.stringify(sampleRecord, null, 2));
    
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