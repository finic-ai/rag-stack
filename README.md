# rag-stack
Deploy retrieval-augmented generation to chat your data with open-source LLMs like XGen, Falcon, and GPT4All

Rag-stack deploys the following resources for retrieval-augmented generation:

### Open-source LLM
* GPT4All: When you run locally, rag-stack will download and deploy Nomic AI's [gpt4all](https://github.com/nomic-ai/gpt4all) model, which runs on consumer CPUs.

* Falcon-7b: On the cloud, rag-stack deploys Technology Innovation Institute's [falcon-7b](https://huggingface.co/tiiuae/falcon-7b) model onto a GPU-enabled GKE cluster.

### Vector database

* [Qdrant](https://github.com/qdrant/qdrant): Qdrant is an open-source vector database written in Rust, so it's highly performant and self-hostable.

### Server + UI

Simple server and UI that handles PDF upload, so that you can chat over your PDFs using Qdrant and the open-source LLM of choice.

![](https://github.com/psychic-api/rag-stack/assets/13636019/d4c17b85-be94-4f16-af37-d5702570ad3f)

## Run locally

To run locally, run `./run-dev`. This will download [ggml-gpt4all-j-v1.3-groovy.bin](https://gpt4all.io/models/ggml-gpt4all-j-v1.3-groovy.bin) into `server/llm/local/` and run the server, LLM, and Qdrant vector database locally.

## Deploy to Google Cloud

To deploy the RAG stack using `Falcon-7B` running on GPUs to your own google cloud instance, go through the following steps:

1. Run `./deploy-gcp.sh`. This will prompt you for your GCP project ID, service account key file, and region.
2. If you get an error on the `Falcon-7B` deployment step, run the following commands and then run `./deploy-gcp.sh` again:

```
gcloud config set compute/zone YOUR-REGION-HERE
gcloud container clusters get-credentials gpu-cluster
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/master/nvidia-driver-installer/cos/daemonset-preloaded.yaml
```
3. You can run the frontend by creating a `.env` file in `ragstack-ui` and setting `VITE_SERVER_URL` to the url of the `ragstack-server` instance in your Google Cloud run.

## Roadmap

* ✅ GPT4all support
* ✅ Falcon-7b support
* ✅ Deployment on GCP
* 🚧 Llama-2-7b support 
* 🚧 Deployment on AWS


## Credits

The code for containerizing Falcon 7B is from Het Trivedi's [tutorial repo](https://github.com/htrivedi99/falcon-7b-truss). Check out his Medium article on how to dockerize Falcon [here](https://towardsdatascience.com/deploying-falcon-7b-into-production-6dd28bb79373)!
