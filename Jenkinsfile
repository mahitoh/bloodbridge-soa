pipeline {
    agent any

    environment {
        KUBECONFIG = '/etc/rancher/k3s/k3s.yaml'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests and Coverage') {
            steps {
                echo 'Running service and client tests with coverage gates...'
                sh 'chmod +x ./test-all.sh'
                sh './test-all.sh'
            }
        }

        stage('Build Docker Images') {
            when { branch 'main' }
            steps {
                echo 'Building Docker images...'
                sh 'docker build -t bloodbridge-auth:latest services/auth-service'
                sh 'docker build -t bloodbridge-donor:latest services/donor-service'
                sh 'docker build -t bloodbridge-hospital:latest services/hospital-service'
                sh 'docker build -t bloodbridge-request:latest services/request-service'
                sh 'docker build -t bloodbridge-location:latest services/location-service'
                sh 'docker build -t bloodbridge-notification:latest services/notification-service'
            }
        }

        stage('Import Images into K3s') {
            when { branch 'main' }
            steps {
                sh 'docker save bloodbridge-auth:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-donor:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-hospital:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-request:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-location:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-notification:latest | k3s ctr images import -'
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                echo 'Deploying to Kubernetes...'
                sh 'kubectl apply -f k8s/'
                sh 'kubectl rollout status deployment/auth-service --timeout=60s'
                sh 'kubectl rollout status deployment/donor-service --timeout=60s'
                sh 'kubectl rollout status deployment/hospital-service --timeout=60s'
                sh 'kubectl rollout status deployment/request-service --timeout=60s'
                sh 'kubectl rollout status deployment/location-service --timeout=60s'
                sh 'kubectl rollout status deployment/notification-service --timeout=60s'
            }
        }

        stage('Regression Tests') {
            when { branch 'main' }
            steps {
                echo 'Running regression tests...'
                sh '''
                    sleep 10
                    curl -f http://localhost:30001/health && echo "✅ Auth OK"
                    curl -f http://localhost:30002/health && echo "✅ Donor OK"
                    curl -f http://localhost:30003/health && echo "✅ Hospital OK"
                    curl -f http://localhost:30004/health && echo "✅ Request OK"
                    curl -f http://localhost:30005/health && echo "✅ Location OK"
                    curl -f http://localhost:30006/health && echo "✅ Notification OK"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Coverage verified and deployed to production!'
        }
        failure {
            echo '❌ Coverage below 90% or deployment failed!'
        }
    }
}
