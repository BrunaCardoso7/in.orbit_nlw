import fastfy from 'fastify'
import { createGoal } from '../usecase/create-goal'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import type {ZodTypeProvider} from 'fastify-type-provider-zod'
import z from 'zod'
import {getWeekPenddingGoals} from '../usecase/get-week-pendding-goals'
import { goalCompletions } from '../db/schema'
import { createGoalsCompletions } from '../usecase/create-goals-completions'

const app = fastfy().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().min(1).max(7),
      }),
    },
  },
  async request => {
    const { title, desiredWeeklyFrequency } = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app.post(
  '/goals-completions', {
    schema: {
      body: z.object({
        goalId: z.string()
      })
    }
  },async (request) => {
    const {goalId} = request.body

    const result = await createGoalsCompletions({goalId})

    return {
      result  
    }
  }
)

app.get('/pedding-goals', async() => {
  const {peddingGoals} = await getWeekPenddingGoals()

  return {
    peddingGoals
  }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('http server running! \n acess: http://localhost:3333')
  })
