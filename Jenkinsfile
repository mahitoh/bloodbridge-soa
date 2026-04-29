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
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
            }
        }

        stage('Check Coverage') {
            steps {
                dir('services/auth-service') {
                    sh '''
                        if [ -f coverage/coverage-summary.json ]; then
                            COVERAGE=$(node -e "const r=require('./coverage/coverage-summary.json'); console.log(r.total.lines.pct)")
                            echo "Coverage: $COVERAGE%"
                            if (( $(echo "$COVERAGE < 80" | bc -l) )); then
                                echo "WARNING: Coverage $COVERAGE% is below 80% - add more tests!"
                            else
                                echo "PASSED: Coverage is $COVERAGE%"
                            fi
                        else
                            echo "No coverage report found - skipping check"
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
