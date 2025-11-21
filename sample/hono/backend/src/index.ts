import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

app.use(logger())

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

const routes = app
  .get('/api', (c) => {
    return c.text('Hello Hono!')
  })
  .post(
    '/api/users',
    zValidator(
      'json',
      z.object({
        name: z.string().min(2),
        email: z.string(),
        age: z.coerce.number().min(0).optional(),
      })
    ),
    async (c) => {
      const { name, email, age } = c.req.valid('json')

      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        age,
        createdAt: new Date().toISOString(),
      }

      return c.json(user, 201)
    }
  )

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)

export type AppType = typeof routes
