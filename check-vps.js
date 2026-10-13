const fs = require('fs');
const { Client } = require('ssh2');
const conn = new Client();
const pk = fs.readFileSync('d:/client-projects/9/charity-portal/vps_key', 'utf8');

conn.on('ready', () => {
  // Read .env manually and test connection
  const cmd = `cd /var/www/charity-portal && MONGODB_URI=$(grep MONGODB_URI .env | grep -v '#' | grep 'mongodb+srv' | head -1 | cut -d'"' -f2) && echo "URI starts: $(echo $MONGODB_URI | cut -c1-50)" && node -e "
const m = require('./node_modules/mongoose');
const uri = '$MONGODB_URI';
m.connect(uri, {serverSelectionTimeoutMS:15000, family:4})
  .then(() => m.connection.db.collection('settings').findOne())
  .then(r => { console.log('QUERY OK:', r ? 'got data' : 'empty'); process.exit(0); })
  .catch(e => { console.log('ERROR:', e.message); process.exit(1); });
"`;
  conn.exec(cmd, (err, s) => {
    if (err) { console.error(err); conn.end(); return; }
    s.on('close', () => conn.end())
      .on('data', d => process.stdout.write(d))
      .stderr.on('data', d => process.stderr.write(d));
  });
}).connect({ host: '85.115.209.180', port: 22, username: 'root', privateKey: pk });
