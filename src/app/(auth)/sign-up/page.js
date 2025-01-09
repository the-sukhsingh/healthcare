"use client";
import {
  doCreateUserWithEmailAndPassword,
  doSignUpWithGoogle,
} from "@/firebase/auth";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  const form = useForm({
    defaultValues: {
      name: "",
      dateOfBirth: "",
      contact: {
        address: "",
        phone: "",
        email: "",
      },
      adhaar: "",
      gender: "",
      password: "",
    }
  });

  const handleSubmit = async (data) => {
    try {
      setIsSigningUp(true);
      // Create Firebase user
      const firebaseUser = await doCreateUserWithEmailAndPassword(
        data.contact.email,
        data.password
      );

      // Create patient in database
      const response = await fetch("/api/sign-up-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          firebaseUid: firebaseUser.user.uid,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSigningUp(true);
      const result = await doSignUpWithGoogle();
      setGoogleUser(result.user);
      setShowGoogleForm(true);
      
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleFormSubmit = async (data) => {
    try {
      setIsSigningUp(true);
      const response = await fetch("/api/sign-up-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          name: data.name || googleUser.displayName,
          dateOfBirth: data.dateOfBirth,
          contact: {
            ...data.contact,
            email: googleUser.email,
          },
          firebaseUid: googleUser.uid,
          password: "google-auth",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  if (showGoogleForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={form.handleSubmit(handleGoogleFormSubmit)}
          className="bg-white p-8 rounded-lg shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Complete Registration
          </h1>

          <div className="space-y-4">
            {/* Pre-fill email from Google */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (from Google)
              </label>
              <input
                type="email"
                value={googleUser.email}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
              />
            </div>

            {/* Required fields for Google sign-up */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...form.register("dateOfBirth", { required: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="adhaar"
                className="block text-sm font-medium text-gray-700"
              >
                Adhaar
              </label>
              <input
                id="adhaar"
                type="text"
                minLength="12"
                maxLength="12"
                {...form.register("adhaar", {
                  required: true,
                  minLength: 12,
                  maxLength: 12,
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 "
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                {...form.register("gender", { required: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                {...form.register("contact.address", { required: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="text"
                {...form.register("contact.phone", { required: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isSigningUp || !form.formState.isValid}
          >
            Complete Registration
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="bg-white p-8 rounded-lg shadow-md flex flex-col jc items-center"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Registration Form
        </h1>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              minLength={4}
              {...form.register("name", { required: true, minLength: 4 })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              {...form.register("dateOfBirth", {
                required: true,
                validate: (value) => {
                  const date = new Date(value);
                  const now = new Date();
                  return date < now;
                },
              })}
              className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 `}
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              {...form.register("contact.address")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...form.register("contact.phone")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...form.register("contact.email")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="adhaar"
              className="block text-sm font-medium text-gray-700"
            >
              Adhaar
            </label>
            <input
              id="adhaar"
              type="text"
              minLength={12}
              maxLength={12}
              {...form.register("adhaar", {
                required: true,
                minLength: 12,
                maxLength: 12,
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your adhaar"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              {...form.register("gender", { required: true })}
              onChange={(e) => {
                form.setValue("gender", e.target.value, {
                  shouldValidate: true,
                });
              }}
              id="gender"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              minLength={8}
              {...form.register("password", { required: true, minLength: 8 })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="my-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={isSigningUp || !form.formState.isValid}
        >
          Submit
        </button>
        <button
          onClick={handleGoogleSignUp}
          type="button"
          className="w-full flex  items-center justify-center bg-gray-50 text-black py-2 px-4 rounded-md hover:bg-gray-100 transition-colors disabled:bg-gray-300"
          disabled={isSigningUp}
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
          Sign Up with Google
        </button>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
