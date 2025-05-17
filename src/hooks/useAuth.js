import { useState } from 'react'
import axios from 'axios'

function useAuth() {
  const [error, setError] = useState('')

  const handleAuth = async (isLogin, credentials) => {
    setError('')
    try {
      const url = isLogin ? '/auth/login' : '/auth/register'
      const response = await axios.post(url, credentials)
      if (isLogin) {
        return response.data.access_token
      }
      setError('Registration successful! Please login.')
      return true
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
      return false
    }
  }

  const handleGenerate = async (data, token) => {
    setError('')
    try {
      const response = await axios.post('/eis/generate', data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data.link
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate link')
      return null
    }
  }

  return { error, setError, handleAuth, handleGenerate }
}

export default useAuth