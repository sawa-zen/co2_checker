FROM balenalib/raspberry-pi2-python:latest

WORKDIR /usr/src/app

COPY . .
RUN apt-get update --fix-missing \
 && apt-get install -y --no-install-recommends \
    linux-libc-dev \
    libc6-dev \
    gcc \
    make \
    musl-dev \
    python3-smbus \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*
RUN /usr/local/bin/python3.10 -m pip install --upgrade pip
RUN pip install .

