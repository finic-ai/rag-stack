FROM python:3.7-alpine
WORKDIR /ragstack
COPY . .
RUN pip install poetry
RUN poetry install
EXPOSE 8081
COPY . .
CMD ["poetry", "run", "start"]