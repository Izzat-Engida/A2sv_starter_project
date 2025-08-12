'use client'
import React, { useEffect, useState } from 'react'
import { Cycles } from '@/types/globaltype'
import { CycleCard } from './CycleCard'
import { useSession } from 'next-auth/react'
import type { Session as NextAuthSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function Cycl() {
  const { data: session, status } = useSession() as {
    data: NextAuthSession | null
    status: 'authenticated' | 'loading' | 'unauthenticated'
  }

  const [data, setData] = useState<Cycles>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 5
  const router = useRouter()

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) return

    const link = 'https://a2sv-application-platform-backend-team8.onrender.com/cycles'
    const func = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch(link, { method: 'GET' })
        const hold = await res.json()
        if (!res.ok) {
          throw new Error(hold.message || 'Failed to fetch cycles')
        }
        setData(hold)
      } catch (err) {
        console.error('Error fetching cycles:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch cycles')
      } finally {
        setIsLoading(false)
      }
    }
    func()
  }, [session?.accessToken, status])

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 w-full min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <h2 className="text-lg font-semibold text-center sm:text-left">Application Cycles</h2>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Cycles</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#4F46E5] hover:bg-[#4F46E5]/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // No data state
  if (!data?.data?.cycles || data.data.cycles.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Cycles Found</h3>
          <p className="text-gray-500 mb-4">Create your first application cycle to get started.</p>
          <Button
            onClick={() => router.push('/dashboard/admin/admincycles/createcycles')}
            className="bg-[#4F46E5] hover:bg-[#4F46E5]/90"
          >
            Create Cycle
          </Button>
        </div>
      </div>
    )
  }

  const totalCycles = data?.data.cycles.length || 0
  const totalPages = Math.ceil(totalCycles / itemsPerPage)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCycles = data?.data.cycles.slice(indexOfFirstItem, indexOfLastItem) || []

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center py-4">
        <h2 className="text-lg font-semibold text-center sm:text-left">Application Cycles</h2>
        <Button
          className="mt-2 sm:mt-0 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white"
          onClick={() => {
            router.push('/dashboard/admin/admincycles/createcycles')
          }}
        >
          Create Cycle
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {currentCycles.map((dat) => (
            <Link
              key={dat.id}
              href={`/dashboard/admin/admincycles/managecycles/${dat.id}`}
            >
              <CycleCard cycle={dat} />
            </Link>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded transition-colors ${currentPage === index + 1
                ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cycl
