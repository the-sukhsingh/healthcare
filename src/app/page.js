"use client";
import React from "react";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  Activity,
  HeartPulse,
  Hospital,
} from "lucide-react";
import Link from "next/link";
import {
  FaHospital,
  FaCalendarAlt,
  FaPrescription,
  FaUserMd,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const features = [
  {
    icon: <FaHospital className="text-4xl text-blue-500" />,
    title: "Nearby Hospitals",
    description: "Find healthcares near you with contact and directions",
    link: "/nearbyHospitals",
  },
  {
    icon: <FaCalendarAlt className="text-4xl text-green-500" />,
    title: "Appointment Scheduling",
    description: "Book, manage and track your medical appointments with ease",
    link: "/dashboard?activeComponent=appointment",
  },
  {
    icon: <FaPrescription className="text-4xl text-red-500" />,
    title: "Access Prescriptions",
    description: "View and manage your medical prescriptions securely",
    link: "/dashboard?activeComponent=prescription",
  },
  {
    icon: <FaUserMd className="text-4xl text-purple-500" />,
    title: "Health Records",
    description: "Access your complete medical history and health information",
    link: "/dashboard?activeComponent=records",
  },
];

function StatCard({ number, label }) {
  return (
    <div className="text-center p-8 rounded-2xl bg-white shadow-xl shadow-slate-200">
      <div className="text-4xl font-bold text-slate-900 mb-2">{number}</div>
      <div className="text-slate-600">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link
      href={link}
      className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-rose-500 transition-colors group"
    >
      <div className="mb-4 p-3 rounded-lg bg-rose-50 w-fit group-hover:bg-rose-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </Link>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-600">{subtitle}</p>
    </div>
  );
}

function App() {
  const { userData } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartPulse className="h-8 w-8 text-rose-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">
              HealthFlow
            </span>
          </div>
          <div className="hidden md:flex space-x-8 text-slate-600">
            <a
              href="#features"
              className="hover:text-rose-500 transition-colors"
            >
              Features
            </a>
            <a href="#stats" className="hover:text-rose-500 transition-colors">
              Impact
            </a>
            <a
              href="#contact"
              className="hover:text-rose-500 transition-colors"
            >
              Contact
            </a>
          </div>
          {userData ? (
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-rose-200 transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-rose-200 transition-all"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section with Animation */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-rose-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Activity className="h-5 w-5 text-rose-500" />
                <span className="text-sm font-medium text-slate-800">
                  Trusted by 500+ Hospitals
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Smart Healthcare
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                  Management
                </span>
              </h1>
              <p className="text-lg text-slate-600">
                Revolutionize your healthcare facility with our management
                system.
              </p>
              <div className="flex space-x-4">
                <Link
                  href={"/sign-in"}
                 className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all flex items-center group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={"/nearbyHospitals"}
                 className="border-2 border-slate-200 px-8 py-4 rounded-full font-semibold hover:border-rose-500 hover:text-rose-500 transition-colors flex items-center">
                  <Hospital className="mr-2 h-5 w-5" />
                  Find Nearby Hospitals
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl rotate-3 blur-xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80"
                alt="Medical Dashboard"
                className="rounded-3xl shadow-2xl relative"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="98%" label="Patient Satisfaction" />
            <StatCard number="45%" label="Reduced Wait Times" />
            <StatCard number="2.5x" label="Efficiency Increase" />
            <StatCard number="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle
            title="Comprehensive Features"
            subtitle="Explore the key features that make our system the best choice for healthcare management."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Healthcare Facility?
            </h2>
            <p className="text-slate-300 text-lg">
              Join hundreds of healthcare providers who have already modernized
              their operations with HealthFlow.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-semibold transition-colors flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <HeartPulse className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-white">HealthFlow</span>
            </div>
            <div className="text-center md:text-right">
              <p>© 2024 HealthFlow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
