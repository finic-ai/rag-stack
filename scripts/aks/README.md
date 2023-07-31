### Connect to AKS cluster

`az aks get-credentials --resource-group rag-stack-resources --name rag-stack --overwrite-existing`

### Connect to rag-server service

`kubectl port-forward -n rag-stack svc/rag-server-service 8081:8081`
