# 🧺 RAGstack

Deploy a private ChatGPT alternative hosted within your VPC. Connect it to your organization's knowledge base and use it as a corporate oracle. Supports open-source LLMs like Llama 2, Falcon, and GPT4All.

<p align="center">
<a href="https://discord.gg/vhxm8qMQc">
    <img alt="Discord" src="https://img.shields.io/discord/1131844815005429790?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" />
</a>
<a href="https://github.com/psychicapi/rag-stack/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/psychicapi/psychic?color=blue" alt="Issues">
</a>
  <a href="https://twitter.com/psychicapi" target="_blank">
    <img src="https://img.shields.io/twitter/follow/psychicapi?style=social" alt="Twitter">
</a>
</p>

**Retrieval Augmented Generation (RAG)** is a technique where the capabilities of a large language model (LLM) are augmented by retrieving information from other systems and inserting them into the LLM’s context window via a prompt. This gives LLMs information beyond what was provided in their training data, which is necessary for almost every enterprise use case. Examples include data from current web pages, data from SaaS apps like Confluence or Salesforce, and data from documents like sales contracts and PDFs.

RAG works better than fine-tuning the model because it’s cheaper, it’s faster, and it’s more reliable since the source of information is provided with each response.

RAGstack deploys the following resources for retrieval-augmented generation:

### Open-source LLM

- GPT4All: When you run locally, RAGstack will download and deploy Nomic AI's [gpt4all](https://github.com/nomic-ai/gpt4all) model, which runs on consumer CPUs.

- Falcon-7b: On the cloud, RAGstack deploys Technology Innovation Institute's [falcon-7b](https://huggingface.co/tiiuae/falcon-7b) model onto a GPU-enabled GKE cluster.

- LLama 2: On the cloud, RAGstack can also deploy the 7B paramter version of Meta's [Llama 2](https://ai.meta.com/llama/) model onto a GPU-enabled GKE cluster.

### Vector database

- [Qdrant](https://github.com/qdrant/qdrant): Qdrant is an open-source vector database written in Rust, so it's highly performant and self-hostable.

### Server + UI

Simple server and UI that handles PDF upload, so that you can chat over your PDFs using Qdrant and the open-source LLM of choice.
<img width="800" alt="Screenshot 2023-08-02 at 9 22 27 PM" src="https://github.com/psychic-api/rag-stack/assets/14931371/385f07d0-765f-4afd-b2da-88c3126184b7">

## Run locally

1. Copy `ragstack-ui/local.env` into `ragstack-ui/.env`
2. Copy `server/example.env` into `server/.env`
3. In `server/.env` replace `YOUR_SUPABASE_URL` with your supabase project url and `YOUR_SUPABASE_KEY` with your supabase secret API key. In `ragstack-ui/.env` replace `YOUR_SUPABASE_URL` with your supabase project url and `YOUR_SUPABASE_PUBLIC_KEY` with your supabase secret API key. You can find these values in your supabase dashboard under [Settings > API](https://supabase.com/docs/guides/api/api-keys)
4. In Supabase, create a table `ragstack_users` with the following columns:
   | Column name | Type |
   | ----------- | ---- |
   | id | uuid |
   | app_id | uuid |
   | secret_key | uuid |
   | email | text |
   | avatar_url | text |
   | full_name | text |

If you added row level security, make sure that inserts and selects have a `WITH CHECK` expression of `(auth.uid() = id)`.

5. Run `scripts/local/run-dev`. This will download [ggml-gpt4all-j-v1.3-groovy.bin](https://gpt4all.io/models/ggml-gpt4all-j-v1.3-groovy.bin) into `server/llm/local/` and run the server, LLM, and Qdrant vector database locally.

All services will be ready once you see the following message:

```
INFO:     Application startup complete.
```

## Deploy to Google Cloud

To deploy the RAG stack using `Falcon-7B` running on GPUs to your own google cloud instance, go through the following steps:

1. Run `scripts/gcp/deploy-gcp.sh`. This will prompt you for your GCP project ID, service account key file, and region as well as some other parameters (model, HuggingFace token etc).
2. If you get an error on the `Falcon-7B` deployment step, run the following commands and then run `scripts/gcp/deploy-gcp.sh` again:

```
gcloud config set compute/zone YOUR-REGION-HERE
gcloud container clusters get-credentials gpu-cluster
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/master/nvidia-driver-installer/cos/daemonset-preloaded.yaml
```

The deployment script was implemented using Terraform.

3. You can run the frontend by creating a `.env` file in `ragstack-ui` and setting `VITE_SERVER_URL` to the url of the `ragstack-server` instance in your Google Cloud run.

## Deploy to AWS

To deploy the RAG stack using `Falcon-7B` running on GPUs to your own AWS EC2 instances (using ECS), go through the following steps:

1. Run `scripts/aws/deploy-aws.sh`. This will prompt you for your AWS credentials as well as some other parameters (model, HuggingFace token etc).

The deployment script was implemented using Terraform.

3. You can run the frontend by creating a `.env` file in `ragstack-ui` and setting `VITE_SERVER_URL` to the url of the ALB instance.

## Deploy to Azure

To deploy the RAG stack using `Falcon-7B` running on GPUs to your own AKS, go through the following steps:

1. Run `./azure/deploy-aks.sh`. This will prompt you for your AKS subscription as well as some other parameters (model, HuggingFace token etc).

The deployment script was implemented using Terraform.

1. You can run the frontend by creating a `.env` file in `ragstack-ui` and setting `VITE_SERVER_URL` to the url of the `ragstack-server` service in your AKS.

_Please note that this AKS deployment is using node pool with NVIDIA Tesla T4 Accelerator which is not in all subscriptions available_

## Roadmap

- ✅ GPT4all support
- ✅ Falcon-7b support
- ✅ Deployment on GCP
- ✅ Deployment on AWS
- ✅ Deployment on Azure
- 🚧 Llama-2-40b support

## Credits

The code for containerizing Falcon 7B is from Het Trivedi's [tutorial repo](https://github.com/htrivedi99/falcon-7b-truss). Check out his Medium article on how to dockerize Falcon [here](https://towardsdatascience.com/deploying-falcon-7b-into-production-6dd28bb79373)!
