const { Mhz19Pwm } = require('./mhz19Pwm')
const LCD = require('raspberrypi-liquid-crystal');
const sensorLib = require("node-dht-sensor");

const mhz19Pwm = new Mhz19Pwm(12)
const lcd = new LCD(1, 0x27, 16, 2);
lcd.beginSync();

setInterval(() => {
  const dht11Readout = sensorLib.read(11, 14);
  lcd.clearSync();
  lcd.printSync(`T:${dht11Readout.temperature.toFixed(1)}C H:${dht11Readout.humidity.toFixed(1)}%`);
  lcd.setCursorSync(0, 1);
  lcd.printSync(`CO2:${mhz19Pwm.getCO2()}ppm`);
}, 10000)

// サーバーが終了するときに LCD をクリア
process.on('SIGINT', () => {
  lcd.clearSync();
  // pigpio の終了処理
  mhz19Pwm.dispose();
  process.exit();
});