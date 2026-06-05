import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  AlertCircle,
  Clock,
  Navigation,
  Users
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { requestAPI } from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const Step1 = ({ data, update, onNext }) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Blood Details</h2>
        <p className="text-gray-500">Select the blood type and quantity required</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bloodTypes.map(type => (
          <button
            key={type}
            onClick={() => update({ bloodType: type })}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
              data.bloodType === type 
                ? 'border-primary-red bg-primary-light shadow-lg' 
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <BloodTypeBadge type={type} className="w-12 h-12 text-xl" />
            <span className={`font-bold ${data.bloodType === type ? 'text-primary-red' : 'text-gray-900'}`}>{type}</span>
          </button>
        ))}
      </div>

      <div className="card max-w-sm mx-auto">
        <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Units Needed</p>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => update({ units: Math.max(1, data.units - 1) })}
            className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition-colors"
          >-</button>
          <span className="text-4xl font-display font-bold">{data.units}</span>
          <button 
            onClick={() => update({ units: data.units + 1 })}
            className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl font-bold hover:bg-gray-100 transition-colors"
          >+</button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          disabled={!data.bloodType}
          onClick={onNext}
          className="btn-primary px-10 gap-2 h-12"
        >
          Next Step <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  )
}

const Step2 = ({ data, update, onNext, onBack }) => {
  const urgencies = [
    { label: 'Critical', color: 'red', desc: 'Required within 2 hours' },
    { label: 'Urgent', color: 'amber', desc: 'Required within 24 hours' },
    { label: 'Standard', color: 'blue', desc: 'Required within 72 hours' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Urgency & Radius</h2>
        <p className="text-gray-500">How quickly do you need this and how far should we look?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {urgencies.map(u => (
          <button
            key={u.label}
            onClick={() => update({ urgency: u.label })}
            className={`p-6 rounded-2xl border-2 transition-all text-left space-y-2 ${
              data.urgency === u.label 
                ? 'border-primary-red bg-primary-light shadow-lg' 
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              u.color === 'red' ? 'bg-primary-red text-white' : 
              u.color === 'amber' ? 'bg-warning text-white' : 'bg-info text-white'
            }`}>
              {u.label === 'Critical' ? <AlertCircle size={20} /> : u.label === 'Urgent' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <h4 className="font-bold text-gray-900">{u.label}</h4>
            <p className="text-xs text-gray-500">{u.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-bold text-gray-900">Search Radius</label>
          <span className="text-primary-red font-bold">{data.radius} km</span>
        </div>
        <input 
          type="range" 
          min="5" 
          max="100" 
          step="5"
          value={data.radius}
          onChange={(e) => update({ radius: parseInt(e.target.value) })}
          className="w-full accent-primary-red h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
          <span>5km</span>
          <span>50km</span>
          <span>100km</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-gray-900">Additional Notes (Optional)</label>
        <textarea 
          placeholder="e.g. Bring ID, wait at Emergency Entrance..."
          className="input-field min-h-[120px] resize-none"
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} className="btn-secondary px-8">Back</Button>
        <Button onClick={onNext} className="btn-primary px-10 gap-2 h-12">
          Review Request <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  )
}

const Step3 = ({ data, onBack, onSubmit, loading }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Confirm & Preview</h2>
        <p className="text-gray-500">Review your request details before posting</p>
      </div>

      <div className="card border-l-8 border-l-primary-red">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <BloodTypeBadge type={data.bloodType} className="w-16 h-16 text-2xl" />
            <div>
              <h3 className="text-2xl font-bold">{data.units} Units {data.bloodType} Needed</h3>
              <p className="text-gray-500 flex items-center gap-1">
                <AlertCircle size={14} className="text-primary-red" /> {data.urgency} Urgency
              </p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Radius</p>
             <p className="text-xl font-bold text-gray-900">{data.radius} km</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-success-light text-success rounded-full flex items-center justify-center">
               <Users size={24} />
             </div>
             <div>
               <h4 className="font-bold text-gray-900">23 matching donors found</h4>
               <p className="text-xs text-gray-500">Will be notified instantly via SMS and App</p>
             </div>
          </div>
          <Navigation size={24} className="text-gray-300" />
        </div>

        {data.notes && (
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</p>
            <p className="text-gray-700 italic">"{data.notes}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} className="btn-secondary px-8">Back</Button>
            <Button 
              onClick={onSubmit} 
              disabled={loading}
              className="btn-primary px-10 gap-2 h-12 bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Posting...' : '🆘 Post Request Now'}
            </Button>
      </div>
    </div>
  )
}

const PostRequest = () => {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const [hospitalId, setHospitalId] = useState(null)
  const [formData, setFormData] = useState({
    bloodType: '',
    units: 1,
    urgency: 'Critical',
    radius: 20,
    notes: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHospital = async () => {
      if (!user?.email) return
      try {
        const response = await hospitalAPI.get('/hospitals/me')
        setHospitalId(response.data.hospital.id)
      } catch (err) {
        console.error('Failed to fetch hospital:', err)
      }
    }
    fetchHospital()
  }, [user])

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await requestAPI.post('/requests', {
        hospitalId,
        bloodType: formData.bloodType,
        units: formData.units,
        urgency: formData.urgency,
        radius: formData.radius,
        notes: formData.notes,
        status: 'Active'
      })

      if (response.status === 201) {
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-success/20">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl mb-4">Request Posted!</h1>
          <p className="text-gray-500 text-lg mb-10">
            Your request for <span className="font-bold text-gray-900">{formData.units} units of {formData.bloodType}</span> has been broadcasted to <span className="font-bold text-gray-900">23 matching donors</span> within {formData.radius}km.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/hospital/requests')} className="btn-primary px-8 h-12">
              View Request Status
            </Button>
            <Button onClick={() => navigate('/hospital')} className="btn-secondary px-8 h-12">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-12">
          <button onClick={() => navigate('/hospital')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl">Post Blood Request</h1>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-primary-red' : 'w-4 bg-gray-100'}`} />
              ))}
            </div>
          </div>
        </header>

        <div className="card p-8 lg:p-12 shadow-xl border-white/40">
          {step === 1 && <Step1 data={formData} update={updateFormData} onNext={() => setStep(2)} />}
          {step === 2 && <Step2 data={formData} update={updateFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 data={formData} onBack={() => setStep(2)} onSubmit={handleSubmit} />}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PostRequest
