import RPi.GPIO as GPIO
import mh_z19
import dht11
from i2c_lcd import i2c_lcd
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import time

# initialize GPIO
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)
instance = dht11.DHT11(pin=14)

co2 = 0.0
temperature = 0.0
humidity = 0.0

class MyHTTPRequestHandler(BaseHTTPRequestHandler):
  def do_GET(self):
    ut = time.time()
    self.send_response(200)
    self.send_header('Content-Type', 'text/plain; charset=utf-8')
    self.end_headers()
    s = (
      '# HELP room_co2_concentration_ppm 部屋の二酸化酸素濃度の値です\n'
      '# TYPE room_co2_concentration_ppm gauge\n'
      'room_co2_concentration_ppm{room="sawa_zen_studio"} {}\n'
      '# HELP room_temperature_degrees_celsius 部屋の温度の値です\n'
      '# TYPE room_temperature_degrees_celsius gauge\n'
      'room_temperature_degrees_celsius{room="sawa_zen_studio"} {}\n'
      '# HELP room_humidity_percent 部屋の湿度の値です\n'
      '# TYPE room_humidity_percent gauge\n'
      'room_humidity_percent{room="sawa_zen_studio"} {}\n'
    )
    self.wfile.write(s.format(str(co2), str(temperature), str(humidity)).encode('utf-8'))

def watch_air_environment():
  global co2, temperature, humidity
  i2c_lcd.init_display()

  while True:
    out = mh_z19.read_from_pwm()
    co2 = out['co2']

    result = instance.read()
    if result.is_valid():
      temperature = result.temperature
      humidity = result.humidity

    lcd_message = "{}ppm\n{}C / {}%".format(str(co2),
                                            str(temperature), str(humidity))
    i2c_lcd.send_string_to_display(lcd_message)
    time.sleep(1)

def start_server():
  host = "0.0.0.0"
  port = 8080
  server = HTTPServer((host, port), MyHTTPRequestHandler)
  server.serve_forever()

def main():
  thread1 = threading.Thread(target=watch_air_environment)
  thread2 = threading.Thread(target=start_server)
  thread1.start()
  thread2.start()

if __name__ == "__main__":
  main()