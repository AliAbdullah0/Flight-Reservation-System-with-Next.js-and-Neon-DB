"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { deleteReservation } from '@/actions/flight.actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const DeleteButton = ({reservation_id}:{reservation_id:number}) => {
    const [isDeleting,setIsDeleting] = useState(false)
    const handleDelete = async ()=>{
        setIsDeleting(true)
        try {
            const response = await deleteReservation(reservation_id)
            toast.success(response.message)
        } catch (error:any) {
            toast.error(error)
        } finally {
            setIsDeleting(false)
        } 
    }
  return (
    <Button onClick={handleDelete} size={'sm'} className='bg-red-600/65 text-sm mt-2 mb-2 ml-2 mr-2 text-white'>{ isDeleting ? <p className='flex items-center justify-center '><Loader2 className='animate-spin h-4 w-4 mr-2'/> Deleting</p> : "Delete"}</Button>
  )
}

export default DeleteButton