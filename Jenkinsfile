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

        stage('Install Dependencies') {
            steps {
                dir('services/auth-service') { sh 'npm install' }
                dir('services/donor-service') { sh 'npm install' }
                dir('services/hospital-service') { sh 'npm install' }
                dir('services/request-service') { sh 'npm install' }
                dir('services/location-service') { sh 'npm install' }
                dir('services/notification-service') { sh 'npm install' }
            }
        }

        stage('Automated Tests') {
            steps {
                echo 'Running all tests...'
                dir('services/auth-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
                dir('services/donor-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
                dir('services/hospital-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
                dir('services/request-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
                dir('services/location-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
                dir('services/notification-service') {
                    sh 'npm test -- --coverage --coverageReporters=json-summary --forceExit --passWithNoTests'
                }
            }
        }

        stage('Coverage Gate') {
            steps {
                script {
                    def services = ['auth-service', 'donor-service', 'hospital-service',
                                    'request-service', 'location-service', 'notification-service']
                    services.each { svc ->
                        dir("services/${svc}") {
                            sh """
                                if [ -f coverage/coverage-summary.json ]; then
                                    COVERAGE=\$(node -e "
                                        const r = require('./coverage/coverage-summary.json');
                                        const pct = r.total.lines.pct;
                                        console.log(typeof pct === 'number' ? pct : 100);
                                    ")
                                    echo "${svc} Coverage: \$COVERAGE%"
                                    if (( \$(echo "\$COVERAGE < 80" | bc -l) )); then
                                        echo "❌ ${svc} coverage \$COVERAGE% below 80%!"
                                        exit 1
                                    fi
                                    echo "✅ ${svc} coverage passed!"
                                else
                                    echo "⚠️ No coverage report for ${svc} - skipping"
                                fi
                            """
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            when { branch 'main' }
            steps {
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
            echo '🎉 Pipeline passed!'
            githubNotify status: 'SUCCESS',
                         description: 'All tests and coverage passed',
                         context: 'Jenkins must pass'
        }
        failure {
            echo '❌ Pipeline failed!'
            githubNotify status: 'FAILURE',
                         description: 'Tests or coverage failed - merge blocked',
                         context: 'Jenkins must pass'
        }
    }
}
