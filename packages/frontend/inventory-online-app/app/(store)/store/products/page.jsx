'use client'
import { Container } from '@/app/ui/utils/container'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ViewProducts from '@/app/ui/products/all/allProducts'

export default function Products() {
  return (
    <Container
        direction={'column'}
        alignItem={'start'}
        padding='0px'
        width='100%'
    >
        {/* // add new product  */}
        <Link href="#">Agregar un nuevo producto</Link>
        {/* view all products */}
        <ViewProducts />
    </Container>
  )
}



