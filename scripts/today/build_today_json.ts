import fs from 'fs';
import path from 'path';

const JSON_FOLDER = 'scripts/today';

// read quotes.json file
const quotesJson = JSON.parse(
  fs.readFileSync(`${JSON_FOLDER}/quotes.json`, 'utf8')
);

// assume start from 2025-06-10, each day has 1 quotes_id
const startDate = new Date('2025-06-10');
const dateToIdMap: Record<string, number> = {};

// shuffle quotes
const filteredQuotes = quotesJson
  .filter((quote: any) => quote.kind === 'shi' || quote.kind === 'ci')
  .sort(() => Math.random() - 0.5);

filteredQuotes.forEach((quote: any, index: number) => {
  // generate date string for each quote
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + index);
  const dateString = date.toISOString().split('T')[0];

  // map date string to quote's work_id
  dateToIdMap[dateString] = quote.work_id;
});

// save data to JSON format
const jsonContent = JSON.stringify(dateToIdMap, null, 2);

try {
  // create folder if it doesn't exist
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }

  // write data to today.json
  fs.writeFileSync(`${JSON_FOLDER}/today.json`, jsonContent, 'utf-8');

  console.log('today.json has been generated successfully.');
} catch (err) {
  console.error(err);
}
