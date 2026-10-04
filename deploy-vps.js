const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const conn = new Client();

const privateKey = fs.readFileSync(path.join(__dirname, 'vps_key'), 'utf8');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> Executing: ${command}`);
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream
        .on('close', (code, signal) => {
          console.log(`>>> Exited with code: ${code}`);
          resolve({ code, stdout, stderr });
        })
        .on('data', (data) => {
          const str = data.toString();
          process.stdout.write(str);
          stdout += str;
        })
        .stderr.on('data', (data) => {
          const str = data.toString();
          process.stderr.write(str);
          stderr += str;
        });
    });
  });
}

conn.on('ready', async () => {
  console.log('SSH Connection Established successfully!');
  try {
    const cmd = `
      set -e
      TARGET_DIR=$(pm2 jlist | grep -o '"pm2_env":{"pm_cwd":"[^"]*"' | head -n1 | cut -d'"' -f4)
      if [ -z "$TARGET_DIR" ]; then
        TARGET_DIR="/var/www/charity-portal"
      fi
      echo "Target Directory: $TARGET_DIR"
      cd "$TARGET_DIR"
      echo "Current dir: $(pwd)"

      echo "Handling local changes & untracked upload files..."
      git add . || true
      git stash || true

      echo "Pulling latest code from git..."
      git pull origin main

      echo "Building project..."
      npm run build

      echo "Restarting PM2 process..."
      pm2 restart all
      echo "Deployment completed successfully!"
    `;

    await executeCommand(cmd);
    conn.end();
  } catch (err) {
    console.error('Deployment error:', err);
    conn.end();
  }
}).on('error', (err) => {
  console.error('SSH connection error:', err);
}).connect({
  host: '85.115.209.180',
  port: 22,
  username: 'root',
  privateKey: privateKey,
});
