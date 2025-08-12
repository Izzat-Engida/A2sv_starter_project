"use client"
import { BaseFooter } from "@/components/Footer";
import LogoTicker from "@/components/LogoTicker";
import SigninNav from "@/components/SigninNav";
import SignupNav from "@/components/SignupNav";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ClockFading, Globe, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const handleClick = () => {
    router.push("/auth/signup")
  }
  return (
    <main className="flex flex-col">
      <SignupNav />
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="/bg.png"
            alt="Background"
            fill
            className="object-cover object-center opacity-40"
          />
        </div>
        <div className="relative z-10 flex flex-col items-start lg:ml-25 px-4 py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Forge Your Future in Tech
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6">
            Join an elite community of Africa’s brightest minds, and get fast-tracked to a
            software engineering career at the world’s leading tech companies.
          </p>
          <button onClick={handleClick} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold">
            Start Your Application
          </button>
        </div>
      </section>

      {/* Logos */}
      <section className="flex justify-center gap-40 py-8 bg-white">
        {/* <Image src="/variant.png" alt="Next.js" width={100} height={40} />
        <Image src="/variant2.png" alt="Vercel" width={100} height={40} /> */}
        <LogoTicker />
      </section>

      {/* Journey Section */}
      <section className="bg-white py-16 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Your Journey to Silicon Valley
        </h2>
        <p className="text-gray-600 mb-12">
          A proven path from learning to leadership.
        </p>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Phase 1: Foundations",
              desc: "Master data structures, algorithms, and problem-solving techniques in an intensive 3-month bootcamp.",
              svg: <Plus />

            },
            {
              title: "Phase 2: Real-world Projects",
              desc: "Apply your skills to build complex projects, collaborate in teams, and prepare for technical interviews.",
              svg: <ClockFading />
            },
            {
              title: "Phase 3: Internship Placement",
              desc: "We help you secure internships at top global tech companies to gain invaluable experience.",
              svg: <Globe />
            },
            {
              title: "Phase 4: Full-Time Conversion",
              desc: "Excel in your internship and convert it into a full-time offer, launching your global career.",
              svg: <Star />
            },
          ].map((phase, i) => (
            <div key={i} className="text-left">
              <div className="bg-indigo-100 w-10 h-10 flex items-center justify-center rounded-md mb-4">
                <span className="text-indigo-600 font-bold">{phase.svg}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{phase.title}</h3>
              <p className="text-gray-600">{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built by Engineers */}
      <section className="bg-gray-50 py-16 px-4 flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-4">Built by Engineers, for Engineers</h3>
          <p className="text-gray-600">
            A2SV is not just a program; it’s a community. We’re on a mission to
            identify Africa’s most brilliant minds and provide them with the
            resources, mentorship, and opportunities to solve humanity’s
            greatest challenges.
          </p>
        </div>
        <div className="flex-1">
          <Image
            src="/container.png"
            alt="Engineers working"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Alumni Testimonials */}
      <section className="bg-black text-white py-16 px-4 text-center">
        <h3 className="text-2xl font-bold mb-12">Hear from Our Alumni</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              text: `"A2SV completely changed the trajectory of my career. The training is intense, but the community and the opportunities are unparalleled. I'm now at my dream company, and I owe it all to A2SV."`,
              name: "Abel Tadesse",
              role: "Software Engineer, Google",
              img: "/p1.png"
            },
            {
              text: `"The problem-solving skills I learned at A2SV are invaluable. The mentors push you to be your best, and you're surrounded by people who are just as passionate as you are."`,
              name: "Betlehem Tadesse",
              role: "Software Engineer, Amazon",
              img: "/p3.png"
            },
            {
              text: `"A2SV is more than a bootcamp. It’s a family that supports you long after you’ve graduated. The network you build here is for life."`,
              name: "Caleb Alemayehu",
              role: "Software Engineer, Palantir",
              img: "/p2.png"
            },
          ].map((alum, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-lg shadow-lg text-left">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={alum.img} alt={alum.name} />
                  <AvatarFallback>
                    {alum.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{alum.name}</div>
                  <div className="text-gray-400">{alum.role}</div>
                </div>
              </div>
              <p className="text-gray-200">{alum.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-700 text-white text-center py-16 px-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to change your life?
        </h3>
        <p className="mb-6">
          The next application cycle is now open. Take the first step towards your
          dream career.
        </p>
        <button onClick={handleClick} className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">
          Apply Now
        </button>
      </section>
      <BaseFooter />
    </main>
  );
}
