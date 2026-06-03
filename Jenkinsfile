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

        stage('Merge to Main') {
            when {
                not { branch 'main' }
            }
            steps {
                echo 'Coverage passed! Jenkins merging to main...'
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_TOKEN'
                )]) {
                    sh '''
                        git config user.email "jenkins@bloodbridge.com"
                        git config user.name "Jenkins"

                        BRANCH_COMMIT=$(git rev-parse HEAD)
                        echo "Commit to merge: $BRANCH_COMMIT"

                        git fetch https://$GIT_USER:$GIT_TOKEN@github.com/mahitoh/bloodbridge-soa.git +refs/heads/main:refs/remotes/origin/main

                        git checkout -B main origin/main

                        git merge --no-ff $BRANCH_COMMIT -m "ci: auto-merge coverage passed"

                        git push https://$GIT_USER:$GIT_TOKEN@github.com/mahitoh/bloodbridge-soa.git main
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            when { branch 'main' }
            steps {
                echo 'Building Docker images...'
                sh '''
                    docker build -t bloodbridge-auth:latest services/auth-service
                    docker build -t bloodbridge-donor:latest services/donor-service
                    docker build -t bloodbridge-hospital:latest services/hospital-service
                    docker build -t bloodbridge-request:latest services/request-service
                    docker build -t bloodbridge-location:latest services/location-service
                    docker build -t bloodbridge-notification:latest services/notification-service
                    docker build -t bloodbridge-client:latest client
                '''
            }
        }

        stage('Import Images into K3s') {
            when { branch 'main' }
            steps {
                echo 'Importing Docker images into K3s...'
                sh '''
                    docker save \
                        bloodbridge-auth:latest \
                        bloodbridge-donor:latest \
                        bloodbridge-hospital:latest \
                        bloodbridge-request:latest \
                        bloodbridge-location:latest \
                        bloodbridge-notification:latest \
                        bloodbridge-client:latest \
                        | k3s ctr images import -
                '''
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                echo 'Deploying BloodBridge services to Kubernetes...'
                sh 'kubectl apply -f k8s/'
                sh '''
                    for deployment in \
                        auth-service \
                        donor-service \
                        hospital-service \
                        request-service \
                        location-service \
                        notification-service \
                        client
                    do
                        kubectl rollout restart "deployment/${deployment}"
                        kubectl rollout status "deployment/${deployment}" --timeout=90s
                    done
                '''
            }
        }

        stage('Regression Tests') {
            when { branch 'main' }
            steps {
                echo 'Running deployment smoke tests...'
                sh '''
                    sleep 10
                    curl -fsS http://localhost:30000 | grep -q '<title>BloodBridge</title>'
                    curl -fsS http://localhost:30001/health | grep -q 'auth-service'
                    curl -fsS http://localhost:30002/health | grep -q 'donor-service'
                    curl -fsS http://localhost:30003/health | grep -q 'hospital-service'
                    curl -fsS http://localhost:30004/health | grep -q 'request-service'
                    curl -fsS http://localhost:30005/health | grep -q 'location-service'
                    curl -fsS http://localhost:30006/health | grep -q 'notification-service'
                    echo "✅ Client OK"
                    echo "✅ Backend services OK"
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
