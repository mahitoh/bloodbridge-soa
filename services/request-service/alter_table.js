const pool = require('./src/config/db');
const query = `
  ALTER TABLE requests ADD COLUMN IF NOT EXISTS accepted_by_donor_id UUID;
`;
pool.query(query, (err, res) => {
  if (err) {
    console.error('Error altering table:', err);
    process.exit(1);
  }
  console.log('Column added or already exists');
  process.exit(0);
});
