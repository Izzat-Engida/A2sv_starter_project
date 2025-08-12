"use client";
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { adminLinks } from './navSchema'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/lib';
import { Menu, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
const AdminNav = () => {
    const path = usePathname()
    const { data: session } = useSession()
    const role = (session as any)?.role || (session?.user as any)?.role
    const profileHref = (() => {
        switch ((role || '').toLowerCase()) {
            case 'admin':
            case 'user':
            case 'applicant':
            case 'manager':
            case 'reviewer':
                return '/dashboard/profile'
            default:
                return '/dashboard/profile'
        }
    })()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => setIsOpen(false), [path])

    return (
        <nav className='relative bg-white'>
            <div className='mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between'>
                <div className='flex items-center '>
                    <Image
                        src={Logo}
                        width={128}
                        height={32}
                        alt='A2SV logo'
                    />
                </div>

                <div className='hidden md:flex gap-6'>
                    {adminLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative px-2 py-1 hover:text-oxford-blue ${path.startsWith(link.name) ? "text-purple-light " : "text-pale-sky"}`}
                        >
                            {link.name}
                            {path.startsWith(link.name) && (
                                <span className='bg-purple-light absolute -bottom-1 left-0 right-0 h-0.5 rounded' />
                            )}
                        </Link>
                    ))}
                </div>

                <div className='hidden md:flex items-center gap-4'>
                    <Link href={profileHref} className='text-sm hover:underline'>Your Profile</Link>
                    <div className='text-sm text-pale-sky'>{session?.user?.name || 'Admin'}</div>
                    <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
                </div>

                <button
                    type='button'
                    className='md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
                    aria-label='Open main menu'
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(v => !v)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className='md:hidden absolute left-0 right-0 top-full bg-white shadow-md border-t z-50'>
                    <div className='px-4 py-3 space-y-1'>
                        {adminLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block px-2 py-2 rounded hover:bg-gray-50 ${path.startsWith(link.name) ? "text-purple-light" : "text-pale-sky"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className='border-t my-2' />
                        <div className='flex flex-col gap-1 px-2'>
                            <Link href={profileHref} className='py-2 text-sm hover:underline'>Your Profile</Link>
                            <div className='py-2 text-sm text-pale-sky'>{session?.user?.name || 'Admin'}</div>
                            <button className='py-2 text-left' onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default AdminNav