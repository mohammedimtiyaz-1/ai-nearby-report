import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOOGLE_PLACES_API_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ')
      console.error(`❌ Invalid or missing environment variables: ${missingVars}`)
      
      // In development, we might want to continue, but in production, we should fail fast
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Invalid environment variables: ${missingVars}`)
      }
    } else {
      console.error('❌ Unknown error during environment validation')
    }
    return process.env
  }
}

export const env = validateEnv() as z.infer<typeof envSchema>
