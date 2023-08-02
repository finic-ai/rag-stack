FROM python:3.10
WORKDIR /ragstack
COPY . .
RUN pip install --no-cache-dir poetry
RUN poetry install
EXPOSE 8080
CMD ["poetry", "run", "start"]