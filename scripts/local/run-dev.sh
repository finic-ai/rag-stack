echo '    ____              _____ __             __  '
echo '   / __ \____ _____ _/ ___// /_____ ______/ /__'
echo '  / /_/ / __ `/ __ `/\__ \/ __/ __ `/ ___/ //_/'
echo ' / _, _/ /_/ / /_/ /___/ / /_/ /_/ / /__/ ,<   '
echo '/_/ |_|\__,_/\__, //____/\__/\__,_/\___/_/|_|  '
echo '            /____/   '
echo '_______________________________________________'

cleanup() {
    if [ "$cleanup_already_run" = true ]; then
        return 0
    fi

    echo "Stopping Docker containers..."
    if [ "$USE_WEAVIATE_VECTORSTORE" = true ]; then
        docker stop weaviate
        docker rm weaviate
    else
        docker stop qdrant
        docker rm qdrant
    fi

    cleanup_already_run=true
}

trap cleanup EXIT SIGINT

echo 'Starting RagStack in development mode...'
printf '\n💻 Starting UI...\n'
cd ragstack-ui
npm install
npm run dev > /dev/null 2>&1 &
npm_pid=$! 
printf '\n🤖 Starting RAG server...\n'
cd ../server
poetry install
export LLM_TYPE=gpt4all
export QDRANT_URL=http://localhost
if [ -f .env ]; then
  set -a # Automatically export all variables
  source .env
  set +a # Stop automatically exporting variables
fi
# Download the gpt4all model if it doesn't exist
FILE_PATH="llm/local/ggml-gpt4all-j-v1.3-groovy.bin"

if [ ! -f "$FILE_PATH" ]; then
    echo "$FILE_PATH does not exist, downloading..."
    curl -o $FILE_PATH https://gpt4all.io/models/ggml-gpt4all-j-v1.3-groovy.bin
else
    echo "$FILE_PATH already exists, skipping download."
fi

if [ "$USE_WEAVIATE_VECTORSTORE" = true ]; then
    printf '\n🔎 Starting Weaviate...\n'
    docker run -d --name weaviate -p 8082:8082 \
        -e QUERY_DEFAULTS_LIMIT=25 \
        -e AUTHENTICATION_APIKEY_ENABLED=true \
        -e AUTHENTICATION_APIKEY_ALLOWED_KEYS=$WEAVIATE_API_KEY \
        -e AUTHENTICATION_APIKEY_USERS=john@doe.com \
        -e PERSISTENCE_DATA_PATH=/var/lib/weaviate \
        -e DEFAULT_VECTORIZER_MODULE=none \
        -e ENABLE_MODULES= \
        -e CLUSTER_HOSTNAME=node1 \
        semitechnologies/weaviate:latest \
        --host 0.0.0.0 \
        --port 8082 \
        --scheme http
else
    printf '\n💠 Starting Qdrant...\n'
    docker run -d --name qdrant -p 6333:6333 qdrant/qdrant:v1.3.0
fi

printf '\n🔮 Ragstack is almost ready.\nAccess the UI at http://localhost:5173 and send queries to http://localhost:8080/ask-question\n\n'

poetry run start