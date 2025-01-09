"use client"
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useForm } from 'react-hook-form'

const UserData = () => {
  const { userData,setUserData } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: {
      patientId: userData.patientId,
      dateOfBirth: new Date(userData.dateOfBirth).toISOString().split('T')[0],
      gender: userData.gender,
      age: userData.age,
      adhaar: userData.adhaar,
      address: userData.contact.address,
      phone: userData.contact.phone,
      email: userData.contact.email,
    }
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      const response = await fetch('/api/user-data', 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
      const result = await response.json()
      alert(result.message);
      setUserData(result.data);
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-black dark:text-white'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>User Data</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='mb-4'>
            <label className='block text-gray-700  dark:text-white'>Patient ID:</label>
            <input type='text' {...register('patientId')} className='w-full p-2 border rounded text-black' readOnly />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700  dark:text-white'>Date Of Birth:</label>
            <input type='date'
              {...register('dateOfBirth')}

             className='w-full p-2 border rounded text-black' readOnly={!isEditing} />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700  dark:text-white'>Gender:</label>

              <select name="gender" id="gender"
                {...register('gender')}
                className='w-full p-2 border rounded text-black'
                readOnly={!isEditing}
                
                disabled={!isEditing}
              >

                  <option value="male"
                  >Male</option>
                  <option value="female">Female</option>

              </select>

          </div>
          <div className='mb-4'>
            <label className='block text-gray-700  dark:text-white'>Adhaar:</label>
            <input type='text' {...register('adhaar')} className='w-full p-2 border rounded text-black' readOnly={!isEditing} />
          </div>
          
          <div className='mb-4'>
            <label className='block text-gray-700  dark:text-white'>Phone:</label>
            <input type='text' {...register('phone')} className='w-full p-2 border rounded text-black' readOnly={!isEditing} />
          </div>
          

          <div className='mb-4'>
            <label className='block text-gray-700  dark:text-white'>Email:</label>
            <input type='email' {...register('email')} className='w-full p-2 border rounded text-black' readOnly />
          </div>
        </div>
        <div className='flex justify-end space-x-4'>
          {isEditing ? (
            <>
              <button
                type='button'
                onClick={() => setIsEditing(false)}
                className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50'
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              type='button'
              onClick={handleEdit}
              className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors'
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default UserData