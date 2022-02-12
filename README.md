# co2_checker

```
sudo docker build .
sudo docker run --device /dev/gpiomem --device /dev/i2c-1 --device /dev/ttyACM0 --privileged {{ コンテナID }}
```
