import React from 'react'
import { IAstronaut } from "../interfaces"

interface IProps {
  astronauts: IAstronaut[],
  removeAstronaut: (id: number) => void,
  editAstronaut: (id: number) => void,
  page: number,
  maxPages: number | null,
  setPage: (React.Dispatch<React.SetStateAction<number>>);
}

const AstronautTable: React.FC<IProps> = (props) => {
  const nextPage = () => {
    if (canVisitNextPage()) {
      props.setPage(p => p + 1)
    }
  }

  const canVisitPrevPage = (): boolean => {
    return props.page > 1
  }

  const canVisitNextPage = (): boolean => {
    return props.maxPages !== null && props.page < props.maxPages
  }

  const prevPage = () => {
    if (canVisitPrevPage()) {
      props.setPage(p => p - 1)
    }
  }
  if (props.astronauts === null) {
    return <p>loading..</p>
  }
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Birth Date</th>
          <th>Super Power</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.astronauts.map((a) => (
          <tr key={a.id || `${a.firstName}${a.lastName}`}>
            <td>{a.firstName}</td>
            <td>{a.lastName}</td>
            <td>{new Date(a.birthdate).toLocaleDateString('sk-SK')}</td>
            <td>{a.superpower}</td>
            <td className='actions'>
              <button onClick={() => props.removeAstronaut(a.id || -1)}>Remove</button>
              <button onClick={() => props.editAstronaut(a.id || -1)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={5} className='pagination'>
            <div className="justify">
              <button disabled={!canVisitPrevPage()} onClick={prevPage}>Previous Page</button>
              <p>Page {props.page} of {props.maxPages}</p>
              <button disabled={!canVisitNextPage()} onClick={nextPage}>Next Page</button>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

export default AstronautTable