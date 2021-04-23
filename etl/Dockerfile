FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
  wget \
  pandoc \
  rsync \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt
RUN pip install --default-timeout=100 -r /tmp/requirements.txt

WORKDIR /opt/src/etl

ENTRYPOINT ["./scripts/build_all"]