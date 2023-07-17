We use the Truss framework to containerize the Falcon. The code in this repo is from Het Trivedi's [tutorial on depoying Falcon to production](https://github.com/htrivedi99/falcon-7b-truss).

To containerize Falcon, run the command `python main.py`, followed by `docker build falcon7b -t falcon7b:latest`.

To deploy to kubernetes, run `kubectl create -f falcon7b/kubernetes_deployment.yaml`

Note that local development with Truss is not supported on Apple M1/M2 macs. If you have an M1 mac, you can use Github codespaces for containerization.