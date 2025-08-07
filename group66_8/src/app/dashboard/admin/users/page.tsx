'use client';

import { useState } from 'react';
import { useGetusersQuery } from '@/lib/redux/api/userApi';
import { User } from '@/lib/redux/types/users';
import { Button } from '@/components/ui/button';
import { Avatar } from '@radix-ui/react-avatar';
import { Search , ChevronLeft , ChevronRight } from 'lucide-react';
import { current } from '@reduxjs/toolkit';

export default function UsersPage() {

    const [currentPage , setCurrentPage] = useState(1)
    const { data, isLoading, isError } = useGetusersQuery({page: currentPage, limit: 5});
    const [searchTerm, setSearchTerm] = useState('');

    console.log(data)

    const totalUsers = data?.data?.total_count || 0
    const totalPages = Math.ceil(totalUsers / 5)

    const filteredUsers = (data?.data?.users?? []).filter((user: User) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === '...' ? (
        <span key={`ellipsis-${index}`} className="px-2">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => setCurrentPage(page as number)}
          className={`px-3 py-1 rounded text-gray-500 ${
            currentPage === page
              ? 'bg-indigo-300 outline outline-indigo-600'
              : 'outline outline-gray-500'
          }`}
        >
          {page}
        </button>
      )
    );
  };



  console.log(filteredUsers)

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className='flex justify-between items-center my-4'>
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className='text-gray-500'>Administer and manage all users on the platform</p>
        </div>
        <Button className='bg-indigo-600'>Create New User</Button>
      </div>

      <div className="p-3 my-3 border shadow-lg">
        <div className="flex justify-between gap-3 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              className="w-full border pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className='bg-indigo-200 text-black'>All Roles</Button>
        </div>
      </div>

      {isLoading && <p>Loading users...</p>}
      {isError && <p className="text-red-500">Error fetching users</p>}

      <div className='hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] p-3 text-gray-500'>
        <p>Name</p>
        <p>Role</p>
        <p>Status</p>
        <p></p>
      </div>

      <ul className=" shadow-lg">
        {filteredUsers.map((user: User) => (
          <li key={user.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] items-start md:items-center p-3 border">
            <div className='flex items-start md:items-center gap-3'>
              <Avatar className='w-10 h-10'><img src="/150.png"/></Avatar>
              <div className="overflow-hidden">
                <p className="font-semibold truncate max-w-[180px]">{user.full_name}</p>
                <p className="text-sm text-gray-600 truncate max-w-[180px]">{user.email}</p>
              </div>
            </div>
            <p className='text-gray-500 text-sm md:text-base'>{user.role}</p>
            <p className='text-gray-500 text-sm md:text-base'>Active</p>
            <div className='flex gap-3 justify-start md:justify-end text-sm'>
              <button className='text-indigo-600'>Edit</button>
              <button className='text-red-600'>Delete</button>
            </div>
            
          </li>
        ))}
      </ul>
      <div className='flex justify-between m-4'>
        <p className='text-gray-500'>Showing {currentPage * 5 - 4} to {currentPage * 5} of {totalUsers}</p>
        <div className='flex shadow-lg'>
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1 , 1))}
            disabled = {currentPage === 1}
            className='px-1 py-1 text-gray-500 outline outline-gray-300'>
            <ChevronLeft className='h-5'/>
          </button>
          {renderPageNumbers()}
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1 , totalPages))}
            disabled = {currentPage === totalPages}
            className='px-1 py-1 text-gray-500 outline outline-gray-300'
            >
            <ChevronRight className='h-5'/>
          </button>
        </div>
      </div>
    </div>
  );
}
