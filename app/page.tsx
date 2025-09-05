import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Factory,
  Users,
  Settings,
  ArrowRight,
  Shield,
  Clock,
  BarChart3,
  Truck,
  Cog,
  Package,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="/sail.svg"
              alt="SAIL Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <span className="text-2xl font-bold text-gray-900">SAIL BSP</span>
              <p className="text-sm text-gray-600">Bhilai Steel Plant</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Employee Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Access</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              SAIL Bhilai Steel Plant
              <span className="text-blue-700"> Order Management System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              India's flagship integrated steel production facility with
              advanced order processing, inventory management, and real-time
              tracking for rails, heavy structures, and specialty steel
              products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Access System <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl p-8 h-96 flex items-center justify-center border-2 border-dashed border-blue-300 relative overflow-hidden">
              <img
                src="/BSP.jpg" // or imported image
                alt="BSP Facility"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About Bhilai Steel Plant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Established in 1955, BSP stands as a beacon of India's industrial
              prowess with integrated steel production facilities and
              technological advancements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Historical Significance
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Commissioned in 1959 with assistance from the former USSR, BSP
                has evolved into one of India's most prominent steel
                manufacturing units, earning the Prime Minister's Trophy for
                Best Integrated Steel Plant.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">
                    Prime Minister's Trophy Winner
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Factory className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">
                    Fully Integrated Steel Production
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">
                    Exclusive Rail Supplier to Indian Railways
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
                <img
                  src="/historic.jpg" // or your imported image path
                  alt="Historical BSP"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Management System Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Order Management System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive order processing solution designed for BSP's diverse
              product portfolio including rails, heavy structures, and specialty
              steels.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Package className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Manage rails, beams, channels, plates, wire rods, and
                  specialty steel orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 130m single-piece rails</li>
                  <li>• Heavy structural components</li>
                  <li>• Custom specialty steels</li>
                  <li>• Quality specifications tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Monitor production stages from raw materials to finished
                  products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Blast furnace operations</li>
                  <li>• Steel melting shop status</li>
                  <li>• Rolling mill progress</li>
                  <li>• Quality control checkpoints</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Role-based Access</CardTitle>
                <CardDescription>
                  Secure access control for different departments and
                  authorization levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Operations managers</li>
                  <li>• Admin control</li>
                  <li>• User control</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-xl text-gray-600">
              Bhilai Steel Plant's diverse portfolio serves critical
              infrastructure and industrial needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Rails */}
            <div className="text-center">
              <div className="bg-blue-50 rounded-2xl p-8 mb-6 h-48 flex items-center justify-center border-2 border-dashed border-blue-200 relative overflow-hidden">
                <img
                  src="/rails.jpg"
                  alt="Rails"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rails</h3>
              <p className="text-gray-600">
                World's longest 130m single-piece rails for Indian Railways
              </p>
            </div>

            {/* Heavy Structures */}
            <div className="text-center">
              <div className="bg-slate-50 rounded-2xl p-8 mb-6 h-48 flex items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
                <img
                  src="/heavy-structure.jpg"
                  alt="Heavy Structures"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Heavy Structures
              </h3>
              <p className="text-gray-600">
                Beams, channels, and angles for construction projects
              </p>
            </div>

            {/* Specialty Steels */}
            <div className="text-center">
              <div className="bg-green-50 rounded-2xl p-8 mb-6 h-48 flex items-center justify-center border-2 border-dashed border-green-200 relative overflow-hidden">
                <img
                  src="/special-steel.jpg"
                  alt="Specialty Steels"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Specialty Steels
              </h3>
              <p className="text-gray-600">
                Custom steels for defense, automotive, and energy sectors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Steel Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join BSP's advanced order management system and experience efficient
            steel production workflow.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup">
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/sail-logo.jpg"
                  alt="SAIL Logo"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold">SAIL BSP</span>
              </div>
              <p className="text-gray-400">
                Steel Authority of India Limited - Bhilai Steel Plant
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Rails</li>
                <li>Heavy Structures</li>
                <li>Specialty Steels</li>
                <li>Wire Rods</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About BSP</li>
                <li>Facilities</li>
                <li>Careers</li>
                <li>CSR Initiatives</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Bhilai, Chhattisgarh</li>
                <li>India</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Steel Authority of India Limited - Bhilai Steel Plant.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
