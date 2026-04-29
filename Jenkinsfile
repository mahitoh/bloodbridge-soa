pipeline {
    agent any

    environment {
        KUBECONFIG = '/etc/rancher/k3s/k3s.yaml'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Install & Test Auth Service') {
            steps {
                dir('services/auth-service') {
                    sh 'npm install'
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit'
                }
            }
        }

        stage('Check Coverage') {
            steps {
                dir('services/auth-service') {
                    sh '''
                        COVERAGE=$(node -e "const r=require('./coverage/coverage-summary.json'); console.log(r.total.lines.pct)")
                        echo "Coverage: $COVERAGE%"
                        if (( $(echo "$COVERAGE < 80" | bc -l) )); then
                            echo "FAILED: Coverage below 80%"
                            exit 1
                        else
                            echo "PASSED: Coverage is $COVERAGE%"
                        fi
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t bloodbridge-auth:latest services/auth-service'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }

    post {
        success {
            echo '✅ BloodBridge deployed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs above.'
        }
    }
}
