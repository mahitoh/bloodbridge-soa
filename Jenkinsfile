pipeline {
    agent any

    environment {
        KUBECONFIG = '/etc/rancher/k3s/k3s.yaml'
    }

    stages {

        // ─────────────────────────────────────────────
        // 1. CHECKOUT
        // ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ─────────────────────────────────────────────
        // 2. INSTALL DEPENDENCIES
        // ─────────────────────────────────────────────
        stage('Install Dependencies') {
            steps {
                // Backend services
                dir('services/auth-service')         { sh 'npm install' }
                dir('services/donor-service')        { sh 'npm install' }
                dir('services/hospital-service')     { sh 'npm install' }
                dir('services/request-service')      { sh 'npm install' }
                dir('services/location-service')     { sh 'npm install' }
                dir('services/notification-service') { sh 'npm install' }

                // Frontend — only if the client folder exists
                script {
                    if (fileExists('client/package.json')) {
                        dir('client') { sh 'npm install' }
                    } else {
                        echo 'No client folder found — skipping frontend install'
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 3. AUTOMATED TESTS + COVERAGE REPORT
        // ─────────────────────────────────────────────
        stage('Automated Tests') {
            steps {
                echo 'Running all backend tests with coverage...'

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

                // Frontend tests — only if client exists
                script {
                    if (fileExists('client/package.json')) {
                        echo 'Running frontend tests with coverage...'
                        dir('client') {
                            sh 'npm test -- --coverage --passWithNoTests'
                        }
                    } else {
                        echo 'No client folder found — skipping frontend tests'
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 4. COVERAGE GATE — must be >= 90% to pass
        //    Missing report = FAIL (not skip)
        // ─────────────────────────────────────────────
        stage('Coverage Gate') {
            steps {
                script {
                    // All services that MUST have coverage >= 90%
                    def services = [
                        'services/auth-service',
                        'services/donor-service',
                        'services/hospital-service',
                        'services/request-service',
                        'services/location-service',
                        'services/notification-service'
                    ]

                    // Add frontend to the list only if it exists
                    if (fileExists('client/package.json')) {
                        services.add('client')
                    }

                    services.each { svc ->
                        dir(svc) {
                            sh """
                                echo "--- Checking coverage for ${svc} ---"

                                if [ ! -f coverage/coverage-summary.json ]; then
                                    echo "❌ No coverage report found for ${svc} — failing!"
                                    exit 1
                                fi

                                COVERAGE=\$(node -e "
                                    const r = require('./coverage/coverage-summary.json');
                                    const pct = r.total.lines.pct;
                                    console.log(typeof pct === 'number' ? pct : 0);
                                ")

                                echo "${svc} line coverage: \$COVERAGE%"

                                if (( \$(echo "\$COVERAGE < 90" | bc -l) )); then
                                    echo "❌ FAILED — \$COVERAGE% is below the required 90%"
                                    exit 1
                                else
                                    echo "✅ PASSED — \$COVERAGE% meets the 90% requirement"
                                fi
                            """
                        }
                    }

                    echo '✅ All services passed the 90% coverage gate!'
                }
            }
        }

        // ─────────────────────────────────────────────
        // 5. BUILD DOCKER IMAGES  (main branch only)
        // ─────────────────────────────────────────────
        stage('Build Docker Images') {
            when { branch 'main' }
            steps {
                echo 'Building Docker images...'
                sh 'docker build -t bloodbridge-auth:latest         services/auth-service'
                sh 'docker build -t bloodbridge-donor:latest        services/donor-service'
                sh 'docker build -t bloodbridge-hospital:latest     services/hospital-service'
                sh 'docker build -t bloodbridge-request:latest      services/request-service'
                sh 'docker build -t bloodbridge-location:latest     services/location-service'
                sh 'docker build -t bloodbridge-notification:latest services/notification-service'

                script {
                    if (fileExists('client/Dockerfile')) {
                        sh 'docker build -t bloodbridge-frontend:latest client'
                    } else {
                        echo 'No client Dockerfile — skipping frontend Docker build'
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 6. IMPORT IMAGES INTO K3s  (main branch only)
        // ─────────────────────────────────────────────
        stage('Import Images into K3s') {
            when { branch 'main' }
            steps {
                sh 'docker save bloodbridge-auth:latest         | k3s ctr images import -'
                sh 'docker save bloodbridge-donor:latest        | k3s ctr images import -'
                sh 'docker save bloodbridge-hospital:latest     | k3s ctr images import -'
                sh 'docker save bloodbridge-request:latest      | k3s ctr images import -'
                sh 'docker save bloodbridge-location:latest     | k3s ctr images import -'
                sh 'docker save bloodbridge-notification:latest | k3s ctr images import -'

                script {
                    if (fileExists('client/Dockerfile')) {
                        sh 'docker save bloodbridge-frontend:latest | k3s ctr images import -'
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 7. DEPLOY TO PRODUCTION  (main branch only)
        // ─────────────────────────────────────────────
        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                echo 'Deploying to production...'
                sh 'kubectl apply -f k8s/'
                sh 'kubectl rollout status deployment/auth-service         --timeout=60s'
                sh 'kubectl rollout status deployment/donor-service        --timeout=60s'
                sh 'kubectl rollout status deployment/hospital-service     --timeout=60s'
                sh 'kubectl rollout status deployment/request-service      --timeout=60s'
                sh 'kubectl rollout status deployment/location-service     --timeout=60s'
                sh 'kubectl rollout status deployment/notification-service --timeout=60s'
            }
        }

        // ─────────────────────────────────────────────
        // 8. REGRESSION TESTS  (main branch only)
        //    Verify all services are healthy after deploy
        // ─────────────────────────────────────────────
        stage('Regression Tests') {
            when { branch 'main' }
            steps {
                echo 'Waiting for services to be ready...'
                sh '''
                    sleep 15
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

    // ─────────────────────────────────────────────────
    // POST — Report result back to GitHub
    // Context MUST match your branch protection rule exactly:
    //   "Jenkins must pass"
    // ─────────────────────────────────────────────────
    post {
        success {
            echo '🎉 Pipeline passed — reporting success to GitHub'
            githubNotify status: 'SUCCESS',
                         description: 'All tests and coverage passed (>= 90%)',
                         context: 'Jenkins must pass'
        }
        failure {
            echo '❌ Pipeline failed — merge will be blocked on GitHub'
            githubNotify status: 'FAILURE',
                         description: 'Tests or coverage failed — merge blocked',
                         context: 'Jenkins must pass'
        }
    }
}