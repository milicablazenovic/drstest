FROM python:3.11

WORKDIR /app

#ENV FLASK_APP = server.py

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD [ "python", "server.py" ]