FROM balenalib/raspberry-pi-python:latest

WORKDIR /usr/src/app

COPY . .
RUN apt-get update --fix-missing \
 && apt-get install -y --no-install-recommends \
    linux-libc-dev \
    libc6-dev \
    gcc \
    make \
    musl-dev \
    python3-dev \
    python3-smbus \
    i2c-tools \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*
RUN /usr/local/bin/python3.10 -m pip install --upgrade pip
RUN pip install --no-cache-dir .

CMD ["python", "./co2_checker/co2_checker.py"]
