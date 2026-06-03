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
            when {
                not { branch 'main' }
            }
            steps {
                echo 'Jenkins reading committed coverage reports...'
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
                                if [ ! -f coverage/coverage-summary.json ]; then
                                    echo "Missing coverage report for ${svc}."
                                    exit 1
                                fi

                                node -e "
                                    const r = require('./coverage/coverage-summary.json');
                                    const pct = r && r.total && r.total.lines && r.total.lines.pct;
                                    if (typeof pct !== 'number') {
                                        console.error('${svc}: invalid coverage percentage');
                                        process.exit(1);
                                    }

                                    console.log('${svc}: ' + pct + '%');
                                    if (pct < 90) {
                                        console.error('${svc}: coverage ' + pct + '% below 90% - blocked');
                                        process.exit(1);
                                    }

                                    console.log('${svc}: passed');
                                "
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

                        if ! git merge --no-ff $BRANCH_COMMIT -m "ci: auto-merge coverage passed"; then
                            CONFLICTS=$(git diff --name-only --diff-filter=U)
                            REAL_CONFLICTS=$(printf "%s\\n" "$CONFLICTS" | grep -vE '(^|/)coverage/' || true)

                            if [ -n "$REAL_CONFLICTS" ]; then
                                echo "Merge failed due to real source conflicts:"
                                printf "%s\\n" "$REAL_CONFLICTS"
                                git merge --abort || true
                                exit 1
                            fi

                            echo "Only coverage files conflicted — resolving automatically..."
                            printf "%s\\n" "$CONFLICTS" | while IFS= read -r file; do
                                [ -z "$file" ] && continue
                                git checkout --theirs -- "$file" 2>/dev/null || git rm -f -- "$file"
                                git add -- "$file" 2>/dev/null || true
                            done

                            git commit --no-edit
                        fi

                        git push https://$GIT_USER:$GIT_TOKEN@github.com/mahitoh/bloodbridge-soa.git main
                    '''
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
                sh 'docker build -t bloodbridge-client:latest client'
            }
        }

        stage('Import Images into K3s') {
            when { branch 'main' }
            steps {
                echo 'Importing images into K3s...'
                sh 'docker save bloodbridge-auth:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-donor:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-hospital:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-request:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-location:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-notification:latest | k3s ctr images import -'
                sh 'docker save bloodbridge-client:latest | k3s ctr images import -'
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                echo 'Deploying to Kubernetes...'
                sh 'kubectl apply -f k8s/'
                sh 'kubectl rollout restart deployment/auth-service'
                sh 'kubectl rollout restart deployment/donor-service'
                sh 'kubectl rollout restart deployment/hospital-service'
                sh 'kubectl rollout restart deployment/request-service'
                sh 'kubectl rollout restart deployment/location-service'
                sh 'kubectl rollout restart deployment/notification-service'
                sh 'kubectl rollout restart deployment/client'
                sh 'kubectl rollout status deployment/auth-service --timeout=60s'
                sh 'kubectl rollout status deployment/donor-service --timeout=60s'
                sh 'kubectl rollout status deployment/hospital-service --timeout=60s'
                sh 'kubectl rollout status deployment/request-service --timeout=60s'
                sh 'kubectl rollout status deployment/location-service --timeout=60s'
                sh 'kubectl rollout status deployment/notification-service --timeout=60s'
                sh 'kubectl rollout status deployment/client --timeout=60s'
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
            echo '❌ Pipeline failed — check logs above!'
        }
    }
}
