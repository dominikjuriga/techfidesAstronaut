import React, { useEffect, useRef, useState } from 'react'
import { IAstronaut } from '../interfaces'

interface IProps {
  initialState: IAstronaut,
  addAstronaut: (a: IAstronaut) => void,
  updateAstronaut: (a: IAstronaut) => void,
}

const superpowers = ["Healing", "Super Speed", "Super Jump", "Invisibility", "Immortality"]

const AstronautForm: React.FC<IProps> = ({ initialState, addAstronaut, updateAstronaut }) => {
  const [formState, setFormState] = useState<IAstronaut>(initialState)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto Focus the first item in the form when component first renders
    if (ref.current !== null) {
      ref.current.focus()
    }
  }, [])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle Form Input 
    e.preventDefault()
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
  }

  const createAstronautRemote = async () => {
    return await fetch(`http://localhost:3001/astronauts`,
      {
        method: "POST",
        body: JSON.stringify(formState),
        headers: {
          "Content-Type": "application/json"
        }
      })
  }

  const updateAstronautRemote = async () => {
    return await fetch(`http://localhost:3001/astronauts/${initialState.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formState),
        headers: {
          "Content-Type": "application/json"
        }
      })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Handle Form Submit when adding or updating an item
    e.preventDefault()
    setSubmitting(true)

    const response = initialState.id ? await updateAstronautRemote() : await createAstronautRemote()

    // Parse Data from Response
    const result = await response.json()
    setSubmitMessage(result.message)
    if (response.status !== 200) {
      // Handle Fail
      setSubmitting(false)
      return
    }

    initialState.id ? updateAstronaut(result.data) : addAstronaut(result.data)
  }

  if (submitMessage) {
    return <p>{submitMessage}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <fieldset disabled={submitting}>
        <div>
          <label htmlFor="firstName">First Name<span title="Required Field" className="req">*</span></label>
          <input ref={ref} onChange={handleOnChange} minLength={2} value={formState.firstName} required type="text" name="firstName" />
        </div>
        <div>
          <label htmlFor="lastName">Last Name<span title="Required Field" className="req">*</span></label>
          <input onChange={handleOnChange} minLength={2} value={formState.lastName} required type="text" name="lastName" />
        </div>
        <div>
          <label htmlFor="birthdate">Birth Date<span title="Required Field" className="req">*</span></label>
          <input max={new Date().toLocaleDateString("en-CA")} onChange={handleOnChange} value={formState.birthdate} required type="date" name="birthdate" />
        </div>
        <div>
          <label htmlFor="superpower">Super Power<span title="Required Field" className="req">*</span></label>
          <input onChange={handleOnChange} value={formState.superpower} required type="text" name="superpower" list='superpower' />
          <datalist id='superpower'>
            {superpowers.map((superpower) => (
              <option key={superpower} value={superpower} />
            ))}
          </datalist>
        </div>
      </fieldset>
      <button type='submit'>{`${initialState.id ? "Update Astronaut" : "Create Astronaut"}`}</button>
    </form>
  )
}

export default AstronautForm