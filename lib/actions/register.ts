'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import bcrypt from 'bcryptjs'
import { eq, or } from 'drizzle-orm'

export type RegisterState = {
  errors?: {
    name?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  };
  message?: string;
}

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get('name') as string
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string
  const role = formData.get('role') as 'student' | 'coach'

  const errors: RegisterState['errors'] = {}

  if (!name) errors.name = ['Name is required']
  if (!username) errors.username = ['Username is required']
  if (!email) errors.email = ['Email is required']
  if (!/^\S+@\S+$/.test(email)) errors.email = ['Invalid email format']
  if (!password) errors.password = ['Password is required']
  if (password.length < 8) errors.password = ['Password must be at least 8 characters long']
  if (password !== passwordConfirm) errors.passwordConfirm = ['Passwords do not match']

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  // Check if username or email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .get()

  if (existingUser) {
    if (existingUser.username === username) {
      errors.username = ['Username already exists']
    }
    if (existingUser.email === email) {
      errors.email = ['Email already exists']
    }
    return { errors }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create the new user
  try {
    await db.insert(users).values({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    })

    return { message: 'User created successfully' }
  } catch (error) {
    console.error('Error creating user:', error)
    return { errors: { name: ['Failed to create user'] } }
  }
}
