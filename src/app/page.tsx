import prisma from '@/lib/prisma'
import React from 'react'

const Page = async () => {

  const users = await prisma.user.findMany()

  return (
    <div className='text-3xl'>
      {JSON.stringify(users)}
    </div>
  )
}

export default Page
