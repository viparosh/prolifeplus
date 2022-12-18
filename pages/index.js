import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/appointment')
  }, [])
  return <></>
}

export default Home
