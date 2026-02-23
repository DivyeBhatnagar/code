'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, Rocket, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free Tier',
      icon: Zap,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        'Basic AI guidance',
        'Limited prompts (10/month)',
        'Basic execution plan',
        'Community support',
        'Access to core features'
      ],
      cta: 'Get Started',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Pro Tier',
      icon: Rocket,
      price: { monthly: 499, yearly: 4990 },
      description: 'For serious hackers and builders',
      features: [
        'Advanced idea validation',
        'Role-based AI planning',
        'Advanced code generation',
        'Unlimited prompts',
        'Priority support',
        'Advanced execution analytics',
        'Code generation & refactoring',
        'Team collaboration tools'
      ],
      cta: 'Start Pro Trial',
      popular: true,
      color: 'blue'
    },
    {
      name: 'Enterprise Tier',
      icon: Building2,
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'For universities and organizations',
      features: [
        'University-wide access',
        'Custom AI models',
        'Dedicated infrastructure',
        'Institutional licenses',
        'Innovation lab integration',
        'Hackathon hosting support',
        'White-label options',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'indigo'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold">Save 17%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = typeof plan.price[billingCycle] === 'number' 
              ? plan.price[billingCycle] 
              : plan.price[billingCycle];

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                } p-8 hover:shadow-xl transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex p-3 bg-${plan.color}-100 rounded-xl mb-4`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {typeof price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">₹{price}</span>
                        <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">{price}</span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && typeof price === 'number' && price > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{Math.round(price / 12)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.name === 'Enterprise Tier' ? '/contact' : '/register'} className="block">
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Revenue Streams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Additional Revenue Streams
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Subscription Model</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Monthly / yearly student plans</li>
                <li>• Premium AI features</li>
                <li>• Advanced execution analytics</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600 italic">
                AI-guided teams can execute up to 30-40% more efficiently.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">University Partnerships</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Institutional licenses</li>
                <li>• Innovation lab integration</li>
                <li>• Hackathon hosting support</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Startup & Incubator Plans</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• MVP planning tools</li>
                <li>• Founder execution dashboard</li>
                <li>• Team AI collaboration layer</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600 italic">
                Prototype-ready. Scalable. Production-expandable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial for Pro?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 7-day free trial for the Pro tier. No credit card required.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, and net banking for Indian customers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            AI-powered innovation tools scale naturally with the growth of hackathon culture.
          </p>
          <Link href="/register">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
