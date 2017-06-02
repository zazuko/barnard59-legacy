const p = require('..')
const path = require('path')

const kiVal = p.rdf.namedNode('http://example.org/kiVal')
const ligand = p.rdf.namedNode('http://example.org/ligand')
const smiles = p.rdf.namedNode('http://example.org/smiles')
const databaseFile = path.join(__dirname, '../tmp/ki-database.csv')
const inputCount = p.count()
const outputBindingCount = p.count()
const outputQuadCount = p.count()

p.run(() => {
  p.shell.mkdir('-p', path.dirname(databaseFile))
  p.shell.exec('wget http://kidbdev.med.unc.edu/databases/kiDownload/download.php -O "' + databaseFile + '"')
}).then(() => {
  return p.run(p.file.read(databaseFile)
    .pipe(p.csv.parse({
      columns: true,
      relax_column_count: true
    }))
    .pipe(inputCount)
    .pipe(p.filter((row) => {
      return row.Name === '5-HT2A'
    }))
    .pipe(p.map((row) => {
      const subject = p.rdf.namedNode('http://example.org/binding/' + row.Number)

      return [
        p.rdf.quad(subject, kiVal, p.rdf.literal(row['ki Val'])),
        p.rdf.quad(subject, ligand, p.rdf.literal(row.Name)),
        p.rdf.quad(subject, smiles, p.rdf.literal(row.SMILES))
      ]
    }))
    .pipe(outputBindingCount)
    .pipe(p.flatten())
    .pipe(outputQuadCount)
    .pipe(p.ntriples.serialize())
    .pipe(p.stdout())
  )
}).then(() => {
  console.error('input: ' + inputCount.count)
  console.error('bindings: ' + outputBindingCount.count)
  console.error('quads: ' + outputQuadCount.count)
})
