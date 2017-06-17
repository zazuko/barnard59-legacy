const p = require('..')
const path = require('path')

const filenames = [
  'support/concat1.csv',
  'support/concat2.csv'
]

p.concat.object(filenames.map((filename) => {
  return p.file.read(path.join(__dirname, filename))
}))
  .pipe(p.csv.parse({
    relax_column_count: true
  }))
  .pipe(p.map((row) => {
    return JSON.stringify(row) + '\n'
  }))
  .pipe(p.stdout())
