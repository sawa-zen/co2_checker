import RPi.GPIO as GPIO
import mh_z19
import time
# import dht11
from i2c_lcd import i2c_lcd

# initialize GPIO
GPIO.setwarnings(True)
GPIO.setmode(GPIO.BCM)
#instance = dht11.DHT11(pin=14)

def main():
  co2 = 0.0
  temperature = 0.0
  humidity = 0.0
  i2c_lcd.init_display()

  while True:
    out = mh_z19.read_from_pwm()
    co2 = out['co2']

    #result = instance.read()
    #if result.is_valid():
      #temperature = result.temperature
      #humidity = result.humidity

    lcd_message = "{}ppm\n{}C / {}%".format(str(co2),
                                            str(temperature), str(humidity))
    i2c_lcd.send_string_to_display(lcd_message)
    time.sleep(1)

if __name__ == "__main__":
  main()
