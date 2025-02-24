"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowRight, CheckCircle2, Download, Edit2, Calendar, FileDown, ArrowLeft, Star } from "lucide-react"
import dynamic from "next/dynamic"
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })
import { motion } from "framer-motion"

// Payment link configuration
const PAYMENT_LINK_ID = "cm7c8wagn00034dzv71ddm09f" 

interface PaymentStatus {
  success: boolean;
  email: string;
}

export default function Home() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [price, setPrice] = useState(69)
  const [email, setEmail] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (couponCode.toLowerCase() === "demotest") {
      setPrice(1)
      setIsCouponModalOpen(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      const normalizedEmail = email.toLowerCase();
      setEmail(normalizedEmail);
      
      // Register pending purchase with paymentLinkID
      try {
        await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: normalizedEmail,
            paymentLinkID: PAYMENT_LINK_ID,
            action: 'register'
          }),
        });
        
        setIsEmailModalOpen(false);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error('Error registering purchase:', error);
      }
    }
  }

  // Check for completed payment periodically
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        console.log('Checking payment status for:', email)
        const response = await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            paymentLinkID: PAYMENT_LINK_ID 
          }),
        })

        const data = await response.json()
        console.log('Payment status response:', data)
        
        if (data.success && data.shouldShowSuccess) {
          console.log('Payment completed and pending, updating UI')
          setIsPaymentModalOpen(false)
          setPaymentStatus({
            success: true,
            email: email
          })
          setShowConfetti(true)
          return true
        } else {
          console.log('Payment status conditions not met:', {
            success: data.success,
            shouldShow: data.shouldShowSuccess,
            isPending: data.isPending
          })
        }
        return false
      } catch (error) {
        console.error('Error checking payment status:', error)
        return false
      }
    }

    if (!email) return

    // Set up polling
    const pollInterval = setInterval(async () => {
      const completed = await checkPaymentStatus()
      if (completed) {
        console.log('Payment completed, clearing interval')
        clearInterval(pollInterval)
      }
    }, 2000)

    // Initial check
    checkPaymentStatus()

    // Cleanup function
    return () => {
      clearInterval(pollInterval)
    }
  }, [email])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/seoimage.png"
              alt="Sara Postma"
              className="rounded-full h-10 w-10 object-cover"
            />
            <span className="font-semibold text-lg">Sara Postma</span>
          </div>
          <nav className="flex space-x-4">
            <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
              <DialogTrigger asChild>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Redeem coupon
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Redeem Coupon</DialogTitle>
                  <DialogDescription>
                    Enter your coupon code to get a special discount.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCouponSubmit} className="space-y-4 mt-4">
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code..."
                  />
                  <Button type="submit" className="w-full">Apply Coupon</Button>
                </form>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-4 flex-1 flex items-center justify-center">
        {paymentStatus?.success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-white rounded-lg shadow-lg max-w-2xl"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h2>
            <p className="text-xl mb-4">
              We've sent the course access details to {paymentStatus.email}
            </p>
            <p className="text-gray-600">
              Please check your email for further instructions. If you don't receive an email within 5 minutes, please check your spam folder.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                </div>
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="w-full md:w-1/2 mb-6 md:mb-0">
                    <img
                      src="/SEO-COURSE.png"
                      alt="SEO Full Course 2025"
                      className="w-full rounded-lg mb-4 transition-transform hover:scale-105"
                    />
                    <h2 className="text-2xl font-bold mb-4">Master SEO and never worry about marketing again.</h2>
                    <p className="text-gray-600 mb-4">
                      I'll teach you everything you need to know about SEO. From keyword research to pSEO, I got you
                      covered. Get a look inside the kitchen of how me and my team made 10+ of my websites rank #1 in
                      Google.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">SEO Full Course 2025</h1>
                    <p className="text-4xl font-bold text-blue-600 mb-2">US${price}.00</p>
                    <p className="text-gray-600 mb-4">Master the latest SEO techniques and strategies for 2025.</p>

                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                      <p className="font-bold text-yellow-700">🔥 Limited Time Offer!</p>
                      <p className="text-yellow-700">Pre-order now and save 46%</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>2,842 sold already</span>
                        <span>Limited discount</span>
                      </div>
                      <Progress value={57} className="w-full" />
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-4 w-4 text-green-500" />
                        Video course launching in Q4 2025
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-4 w-4 text-green-500" />
                        Step-by-step guide for beginners
                      </li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4">You can easily pay with USDC and get instance access.</p>
                  </div>
                </div>

                <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full mt-8 mb-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
                    >
                      <Star className="mr-2 h-5 w-5" />
                      Pre-order now for $69 <span className="line-through ml-2">$129</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Enter your email to continue</DialogTitle>
                      <DialogDescription>
                        We'll send your course access details to this email after purchase. Make sure to use the same email on the payment page.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email..."
                        />
                      </div>
                      <Button type="submit" className="w-full">Continue to Payment</Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                  <DialogContent className="max-w-4xl w-full !h-[90vh] p-0 bg-background">
                    <div className="relative h-full flex flex-col">
                      <div className="flex-1">
                        <iframe 
                          src={`https://app.braidpay.com/p/fTDoxCuo5Sy`}
                          className="w-full h-full border-[1px] border-gray-200 rounded-lg"
                          allow="payment"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            {/* Test Notice */}
            <div className="text-red-600 text-sm text-center border border-red-200 bg-red-50 p-2 rounded">
              This is a test page as a part of our BraidPay Use Case demos. This page does not actually sell any courses.
            </div>
            {/* Existing Footer Content */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-600 text-center md:text-left">© 2025 SEO Mastery Course by Sara Postma. All rights reserved.</div>
              <a href="https://braidpay.com" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Powered by</span>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-24%20at%202.35.40%E2%80%AFPM-UqymRYWzvC1igf2clq8gjv0gQEvsvi.png"
                    alt="BraidPay Logo"
                    className="h-6"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}