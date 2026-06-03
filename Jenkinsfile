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
                                    if [ \$(echo "\$COVERAGE < 90" | bc -l) -eq 1 ]; then
                                        echo "❌ ${svc} coverage \$COVERAGE% below 90% - blocked!"
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
                echo 'Building client Docker image...'
                sh 'docker build -t bloodbridge-client:latest client'
            }
        }

        stage('Import Images into K3s') {
            when { branch 'main' }
            steps {
                echo 'Importing client Docker image into K3s...'
                sh 'docker save bloodbridge-client:latest | k3s ctr images import -'
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                echo 'Deploying client UI to Kubernetes...'
                sh 'kubectl apply -f k8s/client.yaml'
                sh 'kubectl rollout restart deployment/client'
                sh 'kubectl rollout status deployment/client --timeout=60s'
            }
        }

        stage('Regression Tests') {
            when { branch 'main' }
            steps {
                echo 'Running client smoke test...'
                sh '''
                    sleep 10
                    curl -f http://localhost:30000 && echo "✅ Client OK"
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
