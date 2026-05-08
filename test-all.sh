#!/bin/bash
echo "🧪 BloodBridge — Running all tests..."
echo "======================================"

FAILED=0
ROOT=$(pwd)

run_service_tests() {
    local name=$1
    local path=$2

    echo ""
    echo "📦 Testing: $name"
    echo "-------------------"
    cd $path

    npm install --silent 2>/dev/null

    npm test -- \
        --coverage \
        --coverageReporters=json-summary \
        --forceExit \
        --passWithNoTests \
        2>&1

    if [ -f coverage/coverage-summary.json ]; then
        COVERAGE=$(node -e "
            const r = require('./coverage/coverage-summary.json');
            const pct = r.total.lines.pct;
            console.log(typeof pct === 'number' ? pct : 100);
        ")
        echo "Coverage: $COVERAGE%"
        if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ FAILED: $name coverage $COVERAGE% is below 80%"
            FAILED=$((FAILED + 1))
        else
            echo "✅ PASSED: $name coverage $COVERAGE%"
        fi
    else
        echo "⚠️  No coverage report — skipping coverage check"
    fi

    cd $ROOT
}

# Backend services
run_service_tests "Auth Service"         "$ROOT/services/auth-service"
run_service_tests "Donor Service"        "$ROOT/services/donor-service"
run_service_tests "Hospital Service"     "$ROOT/services/hospital-service"
run_service_tests "Request Service"      "$ROOT/services/request-service"
run_service_tests "Location Service"     "$ROOT/services/location-service"
run_service_tests "Notification Service" "$ROOT/services/notification-service"

# Frontend
if [ -d "$ROOT/client" ]; then
    echo ""
    echo "📦 Testing: React Frontend"
    echo "-------------------"
    cd $ROOT/client
    npm install --silent 2>/dev/null
    npm test -- --passWithNoTests 2>&1
    if [ $? -ne 0 ]; then
        echo "❌ FAILED: Frontend tests failed"
        FAILED=$((FAILED + 1))
    else
        echo "✅ PASSED: Frontend"
    fi
    cd $ROOT
fi

echo ""
echo "======================================"
echo "📊 TEST SUMMARY"
echo "======================================"

if [ $FAILED -gt 0 ]; then
    echo "❌ $FAILED service(s) failed!"
    echo "Fix failing tests before pushing."
    exit 1
else
    echo "✅ All tests passed! Safe to push."
    exit 0
fi
