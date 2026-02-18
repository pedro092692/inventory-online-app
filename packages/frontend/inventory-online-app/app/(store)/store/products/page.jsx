'use client'
import { Container } from '@/app/ui/utils/container'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'


export default function Products() {
  return (
    <>
        {/* // add new product  */}
        <Link href="#">Agregar un nuevo producto</Link>
        {/* view all products */}
        <Link href="/store/products/view">Lista de todos los productos</Link>
    </>
  )
}



