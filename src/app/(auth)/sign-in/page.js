"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/firebase/auth"
import Link from "next/link"
import { useState, useEffect } from "react"

const SignIn = () => {
    const {currentUser, userLoggedIn, loading } = useAuth()
    const router = useRouter()
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [error, setError] = useState("")

    const form = useForm({
        defaultValues: {
            identifier: "",
            password: "",
        }
    })

    const setAuthToken = async (userId, email) => {
        try {
            const response = await fetch('/api/auth/set-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, email }),
            });

            if (!response.ok) {
                throw new Error('Failed to set authentication token');
            }
        } catch (error) {
            console.error('Token setting error:', error);
            throw error;
        }
    };

    const handleSubmit = async (data) => {
        if(isSigningIn) return;
        try {
            setError("")
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(data.identifier, data.password)
            router.replace("/dashboard")
        } catch (error) {
            console.error("Sign in error:", error)
            setError(error.message || "Failed to sign in")
        } finally {
            setIsSigningIn(false)
        }
    }

    const handleGoogleSignIn = async (e) => {
        e.preventDefault()
        if(isSigningIn) return;
        try {
            setError("")
            setIsSigningIn(true)
            const result = await doSignInWithGoogle()
            const response = await fetch(`/api/check-patient?firebaseUid=${result.user.uid}`)
            const data = await response.json()

            if (data.exists) {
                // Set token before redirecting
                await setAuthToken(data.patient.id, result.user.email);
                router.replace("/dashboard")
            } else {
                router.replace(`/sign-up?email=${result.user.email}&name=${result.user.displayName}&firebaseUid=${result.user.uid}`)
            }
        } catch (error) {
            console.error("Google sign in error:", error)
            setError(error.message || "Failed to sign in with Google")
        } finally {
            setIsSigningIn(false)
        }
    }

    // Wait for auth state to be determined
    if(loading) {
        return <div>Loading...</div>
    }

    useEffect(() => {
        if(userLoggedIn) {
            router.push("/dashboard")
        }
    },[])


    if(userLoggedIn) {
        return <><div>
            <h1 className="text-2xl font-bold mb-6 text-center">Already signed in</h1>
            <p className="text-center">You are already signed in. Redirecting to dashboard...</p>
              {currentUser && <p className="text-center">Welcome back, {currentUser.displayName}</p>}
          </div></>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="identifier"
                            {...form.register("identifier", { required: true })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...form.register("password", { required: true })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSigningIn}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                        {isSigningIn ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        disabled={isSigningIn}
                        className="w-full flex items-center justify-center bg-gray-50 text-black py-2 px-4 rounded-md hover:bg-gray-100 transition-colors disabled:bg-gray-300"
                    >
                        <img
                            src="/google-icon.png"
                            alt="Google"
                            className="w-5 h-5 mr-2"
                        />
                        Sign in with Google
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className="text-blue-500 hover:text-blue-700">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignIn
