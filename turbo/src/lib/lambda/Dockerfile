FROM amazonlinux:2

RUN yum update -y && \
    yum install -y python3 python3-devel python3-pip gcc zip && \
    yum clean all

WORKDIR /src

COPY requirements.txt /src/

RUN python3 -m venv .venv && \
    .venv/bin/pip install --upgrade pip && \
    .venv/bin/pip install -r requirements.txt

COPY . /src

RUN mkdir package && \
    cp main.py package/ && \
    cd .venv/lib/python3.7/site-packages/ && \
    zip -r9 /src/package/lambda.zip . && \
    cd /src/package && \
    zip -g lambda.zip main.py

RUN mkdir /src/output