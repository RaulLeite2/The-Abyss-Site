FROM python:3.12-slim

WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python server.py --host 0.0.0.0 --port ${PORT:-8000}"]
