# 📊 Monitoring Setup Guide — Grafana, Prometheus & Kubernetes Ports
> BloodBridge SOA — SEN3244 Software Architecture
> Simple explanation of what everything does and how we set it up

---

## 🗺️ The Big Picture

```
Your microservices run as pods
          ↓
Prometheus scrapes metrics every 15 seconds
          ↓
Grafana reads from Prometheus and draws graphs
          ↓
You open browser and see live dashboards
```

---

## ⛵ What is Helm?

Helm is a **package manager for Kubernetes** — like npm but for Kubernetes apps.

**Without Helm** — you'd manually write 5-6 complex YAML files to install Grafana.

**With Helm** — one command does everything:
```bash
helm install grafana grafana/grafana
```

### How We Installed Helm
```bash
# SSH into VPS
ssh root@64.225.100.80

# Download and install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installation
helm version
```

### How We Added Helm Repositories
```bash
# Add Grafana charts repository
helm repo add grafana https://grafana.github.io/helm-charts

# Add Prometheus charts repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Update repositories (like npm install)
helm repo update
```

---

## 🔥 Prometheus — The Data Collector

### What It Does
Prometheus goes around asking your services "how are you doing?" every 15 seconds and stores the answers in a time-series database.

**Simple analogy:** Prometheus is like a **nurse who checks your vital signs every 15 minutes and writes them in a book**. Grafana is the doctor who reads that book and draws graphs.

### How We Installed It
```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

helm upgrade --install prometheus prometheus-community/prometheus \
  --namespace monitoring \
  --create-namespace \
  --set server.service.type=NodePort \
  --set server.service.nodePort=31000
```

**What each flag means:**
- `--namespace monitoring` — install in a separate "monitoring" namespace
- `--create-namespace` — create that namespace if it doesn't exist
- `--set server.service.type=NodePort` — make it accessible from outside the cluster
- `--set server.service.nodePort=31000` — assign port 31000

### Access Prometheus
```
http://64.225.100.80:31000
```

### Verify Prometheus is Running
```bash
kubectl get pods -n monitoring | grep prometheus
kubectl get services -n monitoring | grep prometheus
```

**Expected output:**
```
prometheus-server   NodePort   10.43.14.2   <none>   80:31000/TCP
```

---

## 📊 Grafana — The Dashboard Tool

### What It Does
Grafana reads data from Prometheus and draws beautiful charts and dashboards. It updates automatically in real time.

**Simple analogy:** Grafana is like the **speedometer and fuel gauge in a car** — shows you what's happening inside your system right now.

### How We Installed It
```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

helm upgrade --install grafana grafana/grafana \
  --namespace monitoring \
  --create-namespace \
  --set service.type=NodePort \
  --set service.nodePort=32000
```

**What each flag means:**
- `--set service.type=NodePort` — expose Grafana outside the cluster
- `--set service.nodePort=32000` — assign port 32000

### Access Grafana
```
http://64.225.100.80:32000
Username: admin
```

### Get Grafana Password
```bash
kubectl get secret --namespace monitoring grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

### Verify Grafana is Running
```bash
kubectl get pods -n monitoring | grep grafana
kubectl get services -n monitoring | grep grafana
```

**Expected output:**
```
grafana   NodePort   10.43.164.136   <none>   80:32000/TCP
```

---

## 🔗 How We Connected Prometheus to Grafana

After installing both we needed to tell Grafana where to find Prometheus data:

1. Open Grafana at `http://64.225.100.80:32000`
2. Go to **Connections → Data sources → Add new data source**
3. Select **Prometheus**
4. Set URL to:
```
http://prometheus-server.monitoring.svc.cluster.local
```
5. Click **Save & test** — should show green ✅

**Why that URL?**
Inside Kubernetes, services talk to each other using internal DNS names in the format:
```
service-name.namespace.svc.cluster.local
```
So `prometheus-server.monitoring.svc.cluster.local` means:
- Service name: `prometheus-server`
- Namespace: `monitoring`

---

## 📈 How We Imported the Dashboard

1. In Grafana go to **Dashboards → Import**
2. Enter dashboard ID: `1860`
3. Click **Load**
4. Select **Prometheus** as data source
5. Click **Import**

Dashboard **1860** is the **Node Exporter Full** dashboard — shows:
- CPU usage
- RAM usage
- Disk usage
- Network traffic
- System load

**This dashboard updates automatically every 15 seconds — no manual refresh needed.**

---

## 🔌 How Ports Work in Kubernetes

There are **3 levels of ports** for every service:

```
Level 1 → Port inside the container (where your code runs)
Level 2 → Port inside Kubernetes cluster (internal)
Level 3 → NodePort (external — accessible from browser)
```

### Example with Auth Service

```yaml
# k8s/auth-service.yaml
ports:
  - port: 3001        ← internal cluster port
    targetPort: 3001  ← container port (matches app.listen in index.js)
    nodePort: 30001   ← external port (what you type in browser)
```

```javascript
// services/auth-service/src/index.js
app.listen(3001)  ← must match targetPort above
```

```dockerfile
# services/auth-service/Dockerfile
EXPOSE 3001       ← must match containerPort
```

**All three must match or the service won't work!**

### Where Ports Are Assigned

| Tool | Port assigned in |
|------|-----------------|
| Your microservices | `k8s/*.yaml` files |
| Grafana | Helm install command `--set service.nodePort=32000` |
| Prometheus | Helm install command `--set server.service.nodePort=31000` |
| Jenkins | Jenkins service file `/etc/systemd/system/jenkins.service` |

---

## 📋 All Running Services & Their Ports

### Monitoring Namespace
```bash
kubectl get services -n monitoring
```
```
NAME                TYPE       PORT(S)
grafana             NodePort   80:32000/TCP   → http://64.225.100.80:32000
prometheus-server   NodePort   80:31000/TCP   → http://64.225.100.80:31000
```

### Default Namespace (Microservices)
```bash
kubectl get services
```
```
NAME                  TYPE       PORT(S)
auth-service          NodePort   3001:30001/TCP  → http://64.225.100.80:30001
donor-service         NodePort   3000:30002/TCP  → http://64.225.100.80:30002
hospital-service      NodePort   3000:30003/TCP  → http://64.225.100.80:30003
request-service       NodePort   3000:30004/TCP  → http://64.225.100.80:30004
location-service      NodePort   3000:30005/TCP  → http://64.225.100.80:30005
notification-service  NodePort   3000:30006/TCP  → http://64.225.100.80:30006
```

### Jenkins
```
http://64.225.100.80:8080
```

---

## 🩺 Useful Monitoring Commands

```bash
# Check all monitoring pods are running
kubectl get pods -n monitoring

# Check all microservice pods are running
kubectl get pods

# See all services and ports at once
kubectl get services
kubectl get services -n monitoring

# Check logs of a specific pod
kubectl logs deployment/auth-service
kubectl logs -n monitoring deployment/grafana

# Restart Grafana if it stops
kubectl rollout restart deployment/grafana -n monitoring

# Restart Prometheus if it stops
kubectl rollout restart deployment/prometheus-server -n monitoring

# Check memory usage on VPS
free -h

# Check which ports are open on VPS
ufw status
```

---

## 🔮 What's Coming Next (When You Write Real Code)

Right now Prometheus only collects **system metrics** (CPU, RAM, disk).

When you add `prom-client` to each microservice, Prometheus will also collect **application metrics** like:
- How many blood requests were made today
- How many donors were notified
- Response time per endpoint
- Error rates

**To add metrics to a service (10 lines of code):**
```bash
# In each service folder
npm install prom-client
```

```javascript
// Add to src/index.js
const client = require('prom-client');
client.collectDefaultMetrics();

const httpRequests = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});
```

Then come back to Grafana and add a new dashboard showing your app metrics.

---

## ✅ Monitoring Checklist

- [x] Helm installed on VPS
- [x] Prometheus installed and running on port 31000
- [x] Grafana installed and running on port 32000
- [x] Prometheus connected to Grafana as data source
- [x] Node Exporter Full dashboard imported (ID: 1860)
- [x] Live graphs showing CPU, RAM, disk, network
- [ ] Add prom-client to microservices (this weekend)
- [ ] Create custom BloodBridge dashboard in Grafana
- [ ] Set up alerts for pod crashes and high CPU

---

*BloodBridge SOA — SEN3244 Software Architecture — ICT University Yaoundé*
