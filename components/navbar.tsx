"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            <img className="w-18 h-10 " src="/HDlogo.png" alt="" />
          </Link>

          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search experiences..."
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"

              />
              <button type="submit" className="ml-2 cursor-pointer bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-lg transition-colors">
                Search
              </button>
            </form>

            {isAuthenticated ? (
              <>
                {/* <Link href="/experiences" className="text-foreground hover:text-primary transition-colors">
                  Experiences
                </Link>
                <Link href="/my-bookings" className="text-foreground hover:text-primary transition-colors">
                  My Bookings
                </Link> */}

                <button
                  onClick={handleLogout}
                  className="bg-primary  cursor-pointer hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  // return (
  //   <nav className="bg-background border-b border-border shadow-sm">
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <div className="flex justify-between items-center h-16">
  //         <Link href="/" className="text-2xl font-bold text-primary">
  //           BookIt
  //         </Link>

  //         <div className="flex items-center gap-6">



  //           {isAuthenticated ? (
  //             <>
  //               {/* <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span> */}
  //               <Link href="/experiences" className="text-foreground hover:text-primary transition-colors">
  //                 Experiences
  //               </Link>
  //               <Link href="/my-bookings" className="text-foreground hover:text-primary transition-colors">
  //                 My Bookings
  //               </Link>


  //               <button
  //                 onClick={handleLogout}
  //                 className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
  //               >
  //                 Logout
  //               </button>
  //             </>
  //           ) : (
  //             <>
  //               <Link href="/login" className="text-foreground hover:text-primary transition-colors">
  //                 Login
  //               </Link>
  //               <Link
  //                 href="/register"
  //                 className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
  //               >
  //                 Sign Up
  //               </Link>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </nav>
  // )

}
