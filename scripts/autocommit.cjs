const { spawnSync } = require('child_process')

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const runCapture = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: false })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
  return (result.stdout || '').trim()
}

const argv = process.argv.slice(2)
const noPushIndex = argv.indexOf('--no-push')
const shouldPush = noPushIndex === -1
const messageArgs = argv.filter((arg) => arg !== '--no-push')

const status = runCapture('git', ['status', '--porcelain'])
if (!status) {
  process.stdout.write('No hay cambios para commitear.\n')
  process.exit(0)
}

run('git', ['add', '-A'])

const message =
  messageArgs.join(' ').trim() || `chore: autocommit ${new Date().toISOString()}`

run('git', ['commit', '-m', message])

if (shouldPush) {
  run('git', ['push', '-u', 'origin', 'HEAD'])
}
