# Student Management System

A simple microservice application with Docker and Kubernetes (Minikube).

## Architecture

- api-gateway (port 3000): single entry point, proxies all requests
- registration-service (port 3001): POST /register
- login-service (port 3002): POST /login (checks email and password, returns a JWT)

Pod 1 holds api-gateway and registration-service. Pod 2 holds login-service.
Both services use the same MongoDB Atlas `students` collection.

Database fields: student_id, student_name, student_mobile, student_email, student_password (hashed with bcrypt).

## Run on Minikube

```bash
minikube start
eval $(minikube docker-env)    # PowerShell: & minikube -p minikube docker-env --shell powershell | Invoke-Expression

docker build -t registration-service:1.0 ./registration-service
docker build -t login-service:1.0 ./login-service
docker build -t api-gateway:1.0 ./api-gateway

kubectl create secret generic mongo-secret --from-literal=MONGO_URI='mongodb+srv://USER:PASS@cluster.mongodb.net/studentdb'

kubectl apply -f k8s/pod1-deployment.yaml
kubectl apply -f k8s/pod2-deployment.yaml
kubectl apply -f k8s/services.yaml

kubectl get pods
minikube service api-gateway-service --url
```

## API (all through the gateway)

- POST /api/register
- POST /api/login

Register body:

```json
{
  "student_name": "Punroth",
  "student_mobile": "012345678",
  "student_email": "test@example.com",
  "student_password": "Pass@1234"
}
```

Login body:

```json
{
  "student_email": "test@example.com",
  "student_password": "Pass@1234"
}
```
