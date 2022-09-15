import type { NextPage } from 'next'
import { useEffect, useState } from "react"
import Head from 'next/head'
import { IAstronaut } from "../interfaces"
import Modal from '../components/Modal'
import AstronautForm from "../components/AstronautForm"
import AstronautTable from "../components/AstronautTable"
import { astronautFormInitialState } from '../static/initialFormData'

const Home: NextPage = () => {
  const [astronauts, setAstronauts] = useState<IAstronaut[]>([])
  const [formInitialState, setFormInitialState] = useState<IAstronaut>(astronautFormInitialState)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [maxPages, setMaxPages] = useState<number>(1)

  let content = null;

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    const response = await fetch(`http://localhost:3001/astronauts/${page}`);
    if (response.status === 200) {
      const result = await response.json()
      setAstronauts(result.data)
      setMaxPages(result.totalPages)
    }
  }

  const addAstronaut = (astronaut: IAstronaut): void => {
    /**
     * Add an astronaut to the local state of the component
     */
    if (page === maxPages && astronauts !== null && astronauts.length < 5) {
      setAstronauts(a => [...a, astronaut])
    }
    if (astronauts?.length === 5) {
      setMaxPages(m => m + 1)
    }
  }

  const editAstronaut = (id: number | null): void => {
    /**
     * Open modal with astronaut form with given user
     * 
     * params
     *  id [integer] - id of astronaut
     */
    if (id !== null && astronauts !== null) {
      const data = astronauts.find((a) => a.id === id);
      setFormInitialState(data || astronautFormInitialState)
      setModalIsOpen(true)
    }
  }

  const updateAstronaut = (astronaut: IAstronaut): void => {
    /**
     * Replace current astronaut object with the one from API
     * 
     * params
     *  astronaut [IAstronaut] - updated astronaut from API
     */
    let newAstronauts = astronauts?.filter((a) => a.id !== astronaut.id)
    newAstronauts?.push(astronaut)
    setAstronauts(newAstronauts)
  }

  const openModal = (): void => {
    // Creating a new astronaut - replace the form state with initial
    setFormInitialState(astronautFormInitialState)
    setModalIsOpen(true)
  }

  const closeModal = (): void => {
    setModalIsOpen(false)
  }

  const addExampleAstronauts = async () => {
    // Create 11 example astronauts
    const response = await fetch(`http://localhost:3001/astronauts/example`, {
      method: "POST"
    })
    if (response.status === 200) {
      fetchData()
    }
  }

  const removeAstronaut = async (id: number | null): Promise<void> => {
    if (id === null) return;
    const response = await fetch(`http://localhost:3001/astronauts/${id}`, {
      method: "DELETE"
    });
    switch (response.status) {
      case 400:
        console.error("Bad Request")
        return;
      case 404:
        console.error("Not Found")
        return
      case 200:
        setAstronauts(ast => {
          const data = ast.filter((a) => a.id !== id)
          if (ast?.length === 1) {
            if (page === 1) {
              // removing the last item from first page
              // should refetch data to not seem as "empty"
              // despite having further items on next pages
              fetchData()
            } else if (page > 1) {
              // Removing last item from a page
              // moves user to the first page
              setPage(1)
            }
          }
          return data
        })
      default:
        return
    }
  }

  if (astronauts === null) {
    content = <p>Loading..</p>
  }

  else if (astronauts.length === 0) {
    content = <p>There are no astronauts present!</p>
  }

  else {
    content =
      <div className="tableContainer">
        <AstronautTable
          astronauts={astronauts}
          page={page}
          setPage={setPage}
          removeAstronaut={removeAstronaut}
          maxPages={maxPages}
          editAstronaut={editAstronaut}
        />
      </div>
  }

  return (
    <div className='container'>
      <Head><title>TechFides Astronauts</title></Head>
      <h1>Astronauts</h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus animi ipsum totam, necessitatibus eveniet maiores deserunt veniam ratione! Asperiores voluptates in illo exercitationem minima nobis assumenda cumque deleniti corrupti. Aspernatur!</p>
      <button className='customBtn' onClick={openModal}>Create an astronaut</button>
      <button className='customBtn' onClick={addExampleAstronauts}>Add Example Data</button>
      {content}
      {modalIsOpen && <Modal title={`${formInitialState.id ? "Update Astronaut" : "New Astronaut"}`} closeModal={closeModal}>
        <AstronautForm
          updateAstronaut={updateAstronaut}
          addAstronaut={addAstronaut} initialState={formInitialState} />
      </Modal>}
    </div>
  )
}

export default Home
