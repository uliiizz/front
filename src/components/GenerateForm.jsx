import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'

function GenerateForm() {
  const [formData, setFormData] = useState({
    T: '',
    k_0: '',
    z: '',
    epsilon_sl: '',
    frequencies: ['', '', ''],
    concentrations: ['', '', ''],
    mobilities: ['', '', '']
  })
  const [link, setLink] = useState('')
  const { error, setError, handleGenerate } = useAuth()
  const { token } = useContext(AuthContext)

  const handleInputChange = (e, index = null, arrayName = null) => {
    const { name, value } = e.target
    if (arrayName) {
      setFormData((prev) => ({
        ...prev,
        [arrayName]: prev[arrayName].map((item, i) => (i === index ? value : item))
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLink('')
    setError('')

    const data = {
      T: Number(formData.T),
      k_0: Number(formData.k_0),
      t3: Number(formData.t3),
      epsilon_sl: Number(formData.epsilon_sl),
      frequencies: formData.frequencies.map(Number),
      concentrations: formData.concentrations.map(Number),
      mobilities: formData.mobilities.map(Number)
    }

    if (
      Object.values(data).some((val) => isNaN(val)) ||
      data.frequencies.some((val) => isNaN(val)) ||
      data.mobilities.some((val) => isNaN(val)) ||
      data.concentrations.some((val) => isNaN(val))
    ) {
      toast.error('All fields must be valid numbers')
      return
    }

    const generatedLink = await handleGenerate(data, token)
    if (generatedLink) {
      setLink(generatedLink)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Generate Link</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded">{error}</div>
        )}
        {link && (
          <div className="mb-4 p-2 bg-green-500 text-white rounded">
            <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
              {link}
            </a>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {['T', 'k_0', 'z', 'epsilon_sl'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor={field}>
                {field.toUpperCase()}
              </label>
              <input
                type="number"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
          {['frequencies', 'concentrations', 'mobilities'].map((arrayName) => (
            <div key={arrayName} className="mb-4">
              <label className="block text-gray-700 mb-2">{arrayName.toUpperCase()}</label>
              <div className="grid grid-cols-3 gap-2">
                {formData[arrayName].map((value, index) => (
                  <input
                    key={`${arrayName}-${index}`}
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(e, index, arrayName)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  )
}

export default GenerateForm