FROM --platform=linux/amd64 python:3.10
WORKDIR /ragstack
COPY . .
RUN pip install --no-cache-dir poetry
RUN poetry install --no-root
EXPOSE 8080
CMD ["poetry", "run", "start"]