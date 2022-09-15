import express, { Application, Request, Response } from 'express'
import cors from 'cors';
import { IAstronaut } from "./interfaces"
const app: Application = express()
import { exampleAstronauts } from './exampleAstronauts';

// Just for development purposes
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// Middleware for providing CORS support
app.use(cors(corsOptions))
// Middleware for json parsing
app.use(express.json())

const port: number = 3001

// Array that holds all the astronauts
// For any further purposes, this should be at least SQLite
let astronauts: IAstronaut[] = [];

// Last ID of an astronaut
let lastId: number = 1;

const isValidAstronaut = (data: any): data is IAstronaut => {
  /**
   * Checks if request data is a valid Astronaut
   * 
   */
  return "firstName" in data
    && "lastName" in data
    && "birthdate" in data
    && "superpower" in data
}

app.get("/astronauts/:page?", (req: Request, res: Response) => {
  /**
   * Get astronauts (paginated)
   * 
   * params
   *  :page? [integer] - page to retrieve (default is 1)
   */
  const perPage = 5 // astronauts per page
  const totalAstronauts = astronauts.length

  // If there are no astronauts, calculations can be omitted
  if (totalAstronauts === 0) {
    res.send({
      totalPages: 1,
      current: -1,
      data: []
    })
    return;
  }

  const totalPages = Math.ceil(totalAstronauts / perPage)
  let page = parseInt(req.params.page)
  if (isNaN(page)) page = 1

  if (page > totalPages) {
    res.status(400).send({ message: "This Page Does Not Exist" });
    return;
  }

  const from = (page - 1) * perPage
  const to = from + perPage

  res.send({
    totalPages,
    current: page,
    data: astronauts.slice(from, to)
  })
})

app.post("/astronauts", (req: Request, res: Response) => {
  /**
   * Create a new astronaut with data from
   * the body.request
   * 
   */
  if (!isValidAstronaut(req.body)) {
    res.status(400).send({ message: "Some Fields Are Incorrect" })
    return
  }

  const { firstName, lastName, birthdate, superpower } = req.body;
  const newAstronaut = {
    id: lastId,
    firstName,
    lastName,
    birthdate,
    superpower,
  }

  astronauts.push(newAstronaut)
  lastId += 1;

  res.send({ message: "Astronaut Created", data: newAstronaut })
})

app.post("/astronauts/example", (req: Request, res: Response) => {
  /**
   * Create example astronauts from a file
   * 
   */
  exampleAstronauts.forEach((ast) => {
    astronauts.push({
      ...ast,
      id: lastId
    })
    lastId += 1
  })
  res.send({ message: "Added 11 Astronauts." })
})

app.put("/astronauts/:id", (req: Request, res: Response) => {
  /**
   * Attempt to update astronaut with given ID
   * and data of type [IAstronaut] in the body
   * 
   * params
   *  :id [integer] - ID of astronaut to be updated
   */
  const id: number = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).send({ message: "ID must be an integer." }); return }

  if (!astronauts.find((a) => a.id === id)) {
    res.status(404).send({ message: `Astronaut with ID ${id} not found.` }); return;
  }

  if (!isValidAstronaut(req.body)) {
    res.status(400).send({ message: "Some Fields Are Incorrect" }); return;
  }

  astronauts = astronauts.filter((a) => a.id !== id)
  astronauts.push(req.body)
  res.send({ message: "Astronaut Updated.", data: req.body })
})

app.delete("/astronauts/:id", (req: Request, res: Response) => {
  /**
   * Attempt to remove astronaut with given ID
   * 
   * params
   *  :id [integer] - ID of astronaut to be removed
   */
  const id: number = parseInt(req.params.id);

  if (isNaN(id)) { res.status(400).send({ message: "ID must be an integer." }); return }

  if (!astronauts.find((a) => a.id === id)) {
    res.status(404).send({ message: `Astronaut with ID ${id} not found.` }); return;
  }

  astronauts = astronauts.filter((a) => a.id !== id)
  res.send({ message: "Astronaut Deleted." })
})

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`)
})