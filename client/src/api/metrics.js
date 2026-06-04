import { authAPI, donorAPI, requestAPI } from './axios'

const parsePrometheusMetrics = (text) => {
  const metrics = {}
  const lines = text.split('\n')
  
  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue
    
    const match = line.match(/^(\w+)(?:\{([^}]+)\})?\s+([\d.]+)/)
    if (match) {
      const [, name, labels, value] = match
      if (labels) {
        const labelObj = {}
        const labelMatches = labels.matchAll(/(\w+)="([^"]+)"/g)
        for (const lm of labelMatches) {
          labelObj[lm[1]] = lm[2]
        }
        if (!metrics[name]) metrics[name] = []
        metrics[name].push({ labels: labelObj, value: parseFloat(value) })
      } else {
        metrics[name] = parseFloat(value)
      }
    }
  }
  return metrics
}

export const fetchAllMetrics = async () => {
  try {
    const [authRes, donorRes, requestRes] = await Promise.all([
      authAPI.get('/metrics').catch(() => ({ data: '' })),
      donorAPI.get('/metrics').catch(() => ({ data: '' })),
      requestAPI.get('/metrics').catch(() => ({ data: '' }))
    ])
    
    return {
      auth: parsePrometheusMetrics(authRes.data),
      donor: parsePrometheusMetrics(donorRes.data),
      request: parsePrometheusMetrics(requestRes.data)
    }
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return { auth: {}, donor: {}, request: {} }
  }
}

export const getTotalsFromMetrics = (metrics) => {
  const usersByRole = {}
  const requestByBloodType = {}
  
  if (metrics.auth?.['bloodbridge_users_by_role']) {
    metrics.auth['bloodbridge_users_by_role'].forEach(m => {
      usersByRole[m.labels.role] = m.value
    })
  }
  
  if (metrics.donor?.['bloodbridge_donors_by_blood_type']) {
    metrics.donor['bloodbridge_donors_by_blood_type'].forEach(m => {
      requestByBloodType[m.labels.blood_type] = m.value
    })
  }
  
  return {
    totalUsers: metrics.auth?.['bloodbridge_total_users'] || 0,
    totalDonors: metrics.donor?.['bloodbridge_total_donors'] || 1,
    availableDonors: metrics.donor?.['bloodbridge_available_donors'] || 0,
    activeRequests: metrics.request?.['bloodbridge_blood_requests_active'] || 0,
    totalRequests: metrics.request?.['bloodbridge_blood_requests_total'] || 0,
    usersByRole,
    donorsByBloodType: requestByBloodType
  }
}