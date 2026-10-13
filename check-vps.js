const fs = require('fs');
const { Client } = require('ssh2');
const conn = new Client();
const pk = fs.readFileSync('d:/client-projects/9/charity-portal/vps_key', 'utf8');

conn.on('ready', () => {
  // Wait 5 seconds for app to start, then curl the home page
  conn.exec('sleep 5 && curl -s -o /dev/null -w "%{http_code} - time: %{time_total}s" http://localhost:3000/', (err, s) => {
    if (err) { console.error(err); conn.end(); return; }
    s.on('close', () => conn.end())
      .on('data', d => process.stdout.write(d))
      .stderr.on('data', d => process.stderr.write(d));
  });
}).connect({ host: '85.115.209.180', port: 22, username: 'root', privateKey: pk });
