import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Fallback manual .env parsing if running standalone
if (!process.env.SUPABASE_ANON_KEY && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lwyknurgoianubqadfsr.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('Error: SUPABASE_ANON_KEY not found in environment!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const CSV_FILE = path.resolve('colleges.csv');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function categorizeCollege(name) {
  const upper = (name || '').toUpperCase();
  if (upper.includes('INDIAN INSTITUTE OF TECHNOLOGY') || upper.includes('(IIT)') || upper.startsWith('IIT ')) {
    return { category: 'IIT', tier: 'Tier 1' };
  }
  if (upper.includes('NATIONAL INSTITUTE OF TECHNOLOGY') || upper.includes('(NIT)') || upper.startsWith('NIT ')) {
    return { category: 'NIT', tier: 'Tier 1' };
  }
  if (upper.includes('INDIAN INSTITUTE OF INFORMATION') || upper.includes('INTERNATIONAL INSTITUTE OF INFORMATION') || upper.includes('(IIIT)')) {
    return { category: 'IIIT', tier: 'Tier 1' };
  }
  if (upper.includes('AIIMS') || upper.includes('MEDICAL COLLEGE') || upper.includes('HEALTH SCIENCES')) {
    return { category: 'Medical', tier: 'Tier 1' };
  }
  if (upper.includes('INDIAN INSTITUTE OF SCIENCE') || upper.includes('IISC')) {
    return { category: 'Central Univ', tier: 'Tier 1' };
  }
  if (upper.includes('CENTRAL UNIVERSITY')) {
    return { category: 'Central Univ', tier: 'Tier 1' };
  }
  if (upper.includes('UNIVERSITY') || upper.includes('VISHWAVIDYALAYA')) {
    return { category: 'State Univ', tier: 'Tier 1' };
  }
  if (upper.includes('AUTONOMOUS') || upper.includes('ENGINEERING COLLEGE') || upper.includes('INSTITUTE OF TECHNOLOGY')) {
    return { category: 'Autonomous', tier: 'Tier 2' };
  }
  return { category: 'College', tier: 'Tier 2' };
}

async function uploadInBatches() {
  console.log(`Starting parsing and upload of ${CSV_FILE} to Supabase...`);
  console.log(`Target: ${SUPABASE_URL} / public.colleges\n`);

  const fileStream = fs.createReadStream(CSV_FILE);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let rowCount = 0;
  let batch = [];
  const BATCH_SIZE = 500;
  let uploadedCount = 0;
  let failedCount = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;

    if (isHeader) {
      isHeader = false;
      continue;
    }

    const columns = parseCSVLine(line);
    // id,state,name,address_line1,address_line2,city,district,pin_code
    if (columns.length < 3) continue;

    rowCount++;
    const [rawId, state, name, address_line1, address_line2, city, district, pin_code] = columns;

    if (!name || name.trim() === '') continue;

    const { category, tier } = categorizeCollege(name);

    batch.push({
      id: `col_${rowCount}`,
      name: name.replace(/^"(.*)"$/, '$1').trim(),
      state: (state || '').trim(),
      city: (city || '').trim(),
      district: (district || '').trim(),
      address_line1: (address_line1 || '').trim(),
      address_line2: (address_line2 || '').trim(),
      pin_code: (pin_code || '').trim(),
      category,
      tier,
      is_active: true,
    });

    if (batch.length >= BATCH_SIZE) {
      const currentBatch = [...batch];
      batch = [];
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          const { error } = await supabase.from('colleges').insert(currentBatch);
          if (error) {
            console.error(`Batch insert error (Attempt ${attempts}):`, error.message);
            await new Promise((r) => setTimeout(r, 1000 * attempts));
          } else {
            uploadedCount += currentBatch.length;
            process.stdout.write(`\r✓ Uploaded: ${uploadedCount.toLocaleString()} / 43,123 colleges...`);
            success = true;
          }
        } catch (err) {
          console.error(`Network error (Attempt ${attempts}):`, err.message);
          await new Promise((r) => setTimeout(r, 1000 * attempts));
        }
      }
      if (!success) {
        failedCount += currentBatch.length;
      }
    }
  }

  // Final batch
  if (batch.length > 0) {
    const { error } = await supabase.from('colleges').insert(batch);
    if (error) {
      console.error('Final batch error:', error.message);
      failedCount += batch.length;
    } else {
      uploadedCount += batch.length;
      process.stdout.write(`\r✓ Uploaded: ${uploadedCount.toLocaleString()} / 43,123 colleges...`);
    }
  }

  console.log(`\n\n==================================================`);
  console.log(`🎉 UPLOAD SUMMARY:`);
  console.log(`   Total Read:     ${rowCount.toLocaleString()} colleges`);
  console.log(`   Total Uploaded: ${uploadedCount.toLocaleString()} colleges`);
  console.log(`   Total Failed:   ${failedCount} colleges`);
  console.log(`==================================================\n`);
}

uploadInBatches().catch(console.error);
