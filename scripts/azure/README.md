## Use RAG Stack

### Connect to AKS cluster

`az aks get-credentials --resource-group rag-stack-resources --name rag-stack --overwrite-existing`

### Connect to RAG Stack UI

`kubectl port-forward -n rag-stack svc/rag-ui 8080:8080`

### Connect to RAG Stack Server

`kubectl port-forward -n rag-stack svc/rag-server 8081:8081`

### Connect to qdrant dashboard

`kubectl port-forward -n rag-stack svc/qdrant 6333:6333`

navigate to: `http://localhost:6333/dashboard`