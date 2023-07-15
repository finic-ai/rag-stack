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
    docker stop qdrant
    docker rm qdrant

    cleanup_already_run=true
}

trap cleanup EXIT SIGINT

echo 'Starting RagStack in development mode...'
echo '💻 Starting UI...'
cd ragstack-ui
npm install
npm run dev > /dev/null 2>&1 &
npm_pid=$! 
echo '\n💠 Starting Qdrant...'
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant:v1.3.0
echo '\n🤖 Starting RAG server...'
cd ../server
poetry run start
