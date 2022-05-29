from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import time

hoge = 'hoge'


class MyHTTPRequestHandler(BaseHTTPRequestHandler):
  def do_GET(self):
    self.send_response(200)
    self.send_header('Content-Type', 'text/plain; charset=utf-8')
    self.end_headers()
    s = (
      '# HELP room_co2_concentration_ppm 部屋の二酸化酸素濃度の値です\n'
      '# TYPE room_co2_concentration_ppm gauge\n'
      'room_co2_concentration_ppm{room="sawa_zen_studio"} 925.0 1460061337\n'
      '# HELP room_temperature_degrees_celsius 部屋の温度の値です\n'
      '# TYPE room_temperature_degrees_celsius gauge\n'
      'room_temperature_degrees_celsius{room="sawa_zen_studio"} 29.0 1460061337\n'
      '# HELP room_humidity_percent 部屋の湿度の値です\n'
      '# TYPE room_humidity_percent gauge\n'
      'room_humidity_percent{room="sawa_zen_studio"} 31.0 1460061337\n'
    )
    self.wfile.write(s.encode('utf-8'))
    # self.wfile.write('{}'.format(hoge).encode('utf-8'))

def watch_air_environment():
  while True:
    global hoge
    hoge='huga'
    time.sleep(1)

def start_server():
  host = "localhost"
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