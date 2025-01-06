const { Mhz19Pwm } = require('./mhz19Pwm')
const LCD = require('raspberrypi-liquid-crystal');
const sensorLib = require("node-dht-sensor");
const express = require('express');

const mhz19Pwm = new Mhz19Pwm(12)
const lcd = new LCD(1, 0x27, 16, 2);
lcd.beginSync();

const app = express({ port: 3000 });
app.get('/metrics', (_req, res) => {
  const dht11Readout = sensorLib.read(11, 14);
  const co2 = mhz19Pwm.getCO2();
  res.send(
    `# HELP room_co2_concentration_ppm 部屋の二酸化炭素濃度の値です\n` +
    `# TYPE room_co2_concentration_ppm gauge\n` +
    `room_co2_concentration_ppm{room="sawa_zen_studio"} ${co2}\n` +
    `# HELP room_temperature_degrees_celsius 部屋の温度の値です\n` +
    `# TYPE room_temperature_degrees_celsius gauge\n` +
    `room_temperature_degrees_celsius{room="sawa_zen_studio"} ${dht11Readout.temperature.toFixed(1)}\n` +
    `# HELP room_humidity_percent 部屋の湿度の値です\n` +
    `# TYPE room_humidity_percent gauge\n` +
    `room_humidity_percent{room="sawa_zen_studio"} ${dht11Readout.humidity.toFixed(1)}\n`
  );
});

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