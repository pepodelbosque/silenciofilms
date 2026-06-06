const { spawnSync } = require('child_process')

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run('git', ['fetch', 'origin', '--prune'])
run('git', ['pull', '--ff-only'])
