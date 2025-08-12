"use client"
import React from 'react'
import apexLogo from '../../public/logo-apex.png'
import celestialLogo from '../../public/logo-celestial.png'
import quantumLogo from '../../public/logo-quantum.png'
import plantir from '../../public/plantir.svg'
import Image from 'next/image';
import google from "../../public/google.svg"
import amazone from "../../public/amazone.svg"
import { motion } from 'framer-motion'


const LogoTicker = () => {
    return (
        <div className="py-8 mt-8 md:py-12 bg-transparent ">
            <div className="container">
                <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
                    <motion.div className="flex gap-14 flex-none" animate={{
                        translateX: "-50%"
                    }}
                        transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: 'linear',
                            repeatType: "loop"
                        }}
                    >
                        {/* <Image
                            src={google}
                            alt="Acme Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        /> */}
                        <Image
                            src={amazone}
                            alt="Acme Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        <Image
                            src={quantumLogo}
                            alt="Quantum Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />


                        <Image
                            src={celestialLogo}
                            alt="celestial Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />

                        <Image
                            src={amazone}
                            alt="Acme Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        {/*Another set of images for animation*/}

                        <Image
                            src={quantumLogo}
                            alt="Quantum Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        <Image
                            src={google}
                            alt="echo Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        <Image
                            src={apexLogo}
                            alt="apex Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        <Image
                            src={celestialLogo}
                            alt="celestial Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        <Image
                            src={plantir}
                            alt="Acme Logo"
                            className='h-8 w-auto'
                            width={18}
                            height={18}
                        />
                        <Image
                            src={amazone}
                            alt="Acme Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                        <Image
                            src={apexLogo}
                            alt="apex Logo"
                            className='h-8 w-auto'
                            width={12}
                            height={12}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default LogoTicker