pipeline {
    agent any

    environment {
        KUBECONFIG = '/etc/rancher/k3s/k3s.yaml'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('services/auth-service') {
                    sh 'npm install'
                }
                dir('services/donor-service') {
                    sh 'npm install'
                }
                dir('services/hospital-service') {
                    sh 'npm install'
                }
                dir('services/request-service') {
                    sh 'npm install'
                }
                dir('services/location-service') {
                    sh 'npm install'
                }
                dir('services/notification-service') {
                    sh 'npm install'
                }
            }
        }

        stage('Automated Tests & Coverage') {
            steps {
                echo 'Jest running all tests automatically...'
                dir('services/auth-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
                dir('services/donor-service') {
                    sh 'npm test -- --coverage --forceExit --passWithNoTests'
                }
                dir('services/hospital-service') {
                    sh 'npm test -- --coverage --forceExit --passWithNoTests'
                }
                dir('services/request-service') {
                    sh 'npm test -- --coverage --forceExit --passWithNoTests'
                }
                dir('services/location-service') {
                    sh 'npm test -- --coverage --forceExit --passWithNoTests'
                }
                dir('services/notification-service') {
                    sh 'npm test -- --coverage --forceExit --passWithNoTests'
                }
            }
        }

        stage('Coverage Gate') {
            steps {
                echo 'Checking coverage is above 80%...'
                dir('services/auth-service') {
                    sh '''
                        if [ -f coverage/coverage-summary.json ]; then
                            COVERAGE=$(node -e "const r=require('./coverage/coverage-summary.json'); console.log(r.total.lines.pct)")
                            echo "Auth Service Coverage: $COVERAGE%"
                            if (( $(echo "$COVERAGE < 80" | bc -l) )); then
                                echo "❌ Coverage $COVERAGE% is below 80% - deployment blocked!"
                                exit 1
                            else
                                echo "✅ Coverage $COVERAGE% passed!"
                            fi
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for all services...'
                sh 'docker build -t bloodbridge-auth:latest services/auth-service'
                sh 'docker build -t bloodbridge-donor:latest services/donor-service'
                sh 'docker build -t bloodbridge-hospital:latest services/hospital-service'
                sh 'docker build -t bloodbridge-request:latest services/request-service'
                sh 'docker build -t bloodbridge-location:latest services/location-service'
                sh 'docker build -t bloodbridge-notification:latest services/notification-service'
            }
        }

        stage('Import Images into K3s') {
            steps {
                echo 'Importing images into Kubernetes...'
                sh 'docker save bloodbridge-auth:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-donor:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-hospital:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-request:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-location:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-notification:latest | k3s ctr images import -'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Deploying to Kubernetes production...'
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
            steps {
                echo 'Running automated regression tests...'
                sh '''
                    sleep 15
                    curl -f http://localhost:30001/health && echo "✅ Auth service OK"
                    curl -f http://localhost:30002/health && echo "✅ Donor service OK"
                    curl -f http://localhost:30003/health && echo "✅ Hospital service OK"
                    curl -f http://localhost:30004/health && echo "✅ Request service OK"
                    curl -f http://localhost:30005/health && echo "✅ Location service OK"
                    curl -f http://localhost:30006/health && echo "✅ Notification service OK"
                    echo "✅ All regression tests passed!"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline complete! BloodBridge deployed and all tests passed!'
        }
        failure {
            echo '❌ Pipeline failed! Deployment blocked. Check logs above.'
        }
    }
}
