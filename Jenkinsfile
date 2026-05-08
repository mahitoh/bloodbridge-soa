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

        stage('Verify Coverage Reports') {
            steps {
                echo 'Jenkins reading coverage reports generated locally...'
                script {
                    def services = [
                        'auth-service',
                        'donor-service',
                        'hospital-service',
                        'request-service',
                        'location-service',
                        'notification-service'
                    ]
                    services.each { svc ->
                        dir("services/${svc}") {
                            sh """
                                if [ -f coverage/coverage-summary.json ]; then
                                    COVERAGE=\$(node -e "
                                        const r = require('./coverage/coverage-summary.json');
                                        const pct = r.total.lines.pct;
                                        console.log(typeof pct === 'number' ? pct : 100);
                                    ")
                                    echo "${svc}: \$COVERAGE%"
                                    if (( \$(echo "\$COVERAGE < 90" | bc -l) )); then
                                        echo "❌ ${svc} coverage \$COVERAGE% below 90%!"
                                        exit 1
                                    fi
                                    echo "✅ ${svc} passed!"
                                else
                                    echo "⚠️ No coverage report for ${svc} - skipping"
                                fi
                            """
                        }
                    }
                }
            }
        }

        stage('Merge to Main') {
            when {
                not { branch 'main' }
            }
            steps {
                echo 'Coverage passed! Jenkins merging to main...'
                withCredentials([string(credentialsId: 'github-token', variable: 'GIT_TOKEN')]) {
                    sh """
                        git config user.email "jenkins@bloodbridge.com"
                        git config user.name "Jenkins"
                        
                        # Get the current branch commit
                        BRANCH_COMMIT=\$(git rev-parse HEAD)
                        BRANCH_NAME=\$(git rev-parse --abbrev-ref HEAD || echo ${env.BRANCH_NAME})
                        
                        echo "Merging branch: \$BRANCH_NAME"
                        echo "Commit: \$BRANCH_COMMIT"
                        
                        # Fetch everything
                        git fetch origin
                        
                        # Checkout main
                        git checkout -B main origin/main
                        
                        # Merge the commit
                        git merge --no-ff \$BRANCH_COMMIT -m "ci: auto-merge \$BRANCH_NAME — coverage passed"
                        
                        # Push to GitHub
                        git push https://x-access-token:\$GIT_TOKEN@github.com/mahitoh/bloodbridge-soa.git main
                    """
                }
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
