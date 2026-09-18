const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`mkdir -p ~/.ssh && echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCvLYf6tpY1RBBGH8RXyfClC/G2perz/x++uPgenoQbUZoKSTmgbPSWwn0nS8Jixl+0AlGJLbL5p7gx31JxxibmGLcE1zPBTI8RGtjCznRg3utxj8FqW9ojz7us1wajZPVj08bPn0ttCmJ6ZIXREut2jP1EwV6C1wno1kARqB6dcg3MNqrK4NiJAMg/4wVIDSGlSO7qqdrF5ctsvue+V9oX9lSV4lZVdA2GYScewaErCzt/j0SCjVJuSw28LcP3/l5NBPUdQNccjhOULQ+bHuBX/yxidYOwnoyYsvuoYpEIn3aGCu/ohV7cAkF8WVzN09uxQAp0k15C4G1Is5BdBk1P" >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '85.115.209.180',
  port: 22,
  username: 'root',
  password: '80a5tP62FPjAgijs0QmN'
});
