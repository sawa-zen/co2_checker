from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import time

hoge = 'hoge'


class MyHTTPRequestHandler(BaseHTTPRequestHandler):
  def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write('{}'.format(hoge).encode('utf-8'))

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