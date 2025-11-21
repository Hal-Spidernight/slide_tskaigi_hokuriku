import { serve } from '@hono/node-server'
import { Hono } from 'hono'
// import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { describeRoute, resolver, openAPIRouteHandler, validator } from 'hono-openapi'

const app = new Hono()

app.use(logger())

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

const UserParams = z.object({
  name: z.string().min(2).describe('The name of the user'),
  email: z.string().describe('The email of the user'),
  age: z.coerce.number().min(0).optional().describe('The age of the user'),
})

const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  age: z.number().optional(),
  createdAt: z.string(),
})

const routes = app
  .get(
    '/api',
    describeRoute({
      description: 'Say hello to the user',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'text/plain': { schema: resolver(z.string()) },
          },
        },
      },
    }),
    (c) => {
      return c.text('Hello Hono!')
    }
  )
  .post(
    '/api/users',
    describeRoute({
      description: 'ユーザー情報を取得するAPI',
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': { schema: resolver(UserResponse) },
          },
        },
      },
    }),
    validator('json', UserParams),
    async (c) => {
      const { name, email, age } = c.req.valid('json')

      const user = {
        id: crypto.randomUUID(),
        name,
        email,
        age,
        createdAt: new Date().toISOString(),
      } satisfies z.infer<typeof UserResponse>

      return c.json(user, 201)
    }
  )

const documentation = {
  openapi: '3.1.0',
  info: {
    title: 'My API',
    version: '0.0.1',
  },
}

app.get('/docs', openAPIRouteHandler(app, { documentation }))

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)

export default app

export type AppType = typeof routes
