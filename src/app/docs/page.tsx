"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function DocsPage() {  // ✅ Fixed: Make sure this is exported as default
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fade-item",
          start: "top 85%",
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="bg-white text-black min-h-screen">
      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-300">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight cursor-pointer">
            <Link href="/welcome">Vivelune</Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/docs" className="hover:text-gray-900 transition font-semibold">
              Docs
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition">
              Contact
            </Link>
            <Link href="/login" className="hover:text-gray-900 transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md shadow-gray-400/20 transition"
            >
              Start Free Trial
            </Link>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <div className="pt-36 px-6 max-w-5xl mx-auto">
        <h1 className="fade-item text-3xl font-semibold mb-2">Vivelune Documentation</h1>
        <p className="fade-item text-gray-600 mb-10">
          Everything you need to build, automate, and scale intelligent workflows.
        </p>

        {/* QUICK START */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">🚀 Quick Start</h2>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-medium mb-3">Get Started in 5 Minutes</h3>
            <ol className="list-decimal ml-6 text-gray-700 space-y-2">
              <li>Sign up for a free trial</li>
              <li>Add your first API credential (OpenAI, Anthropic, etc.)</li>
              <li>Create a new workflow</li>
              <li>Drag and drop nodes to build your automation</li>
              <li>Execute and monitor your workflow</li>
            </ol>
          </div>
        </div>

        {/* CORE CONCEPTS */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">📚 Core Concepts</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Workflows */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="text-blue-600">📊</span> Workflows
              </h3>
              <p className="text-gray-700 text-sm">
                Visual sequences of connected nodes that automate tasks. Each workflow can be triggered manually, by webhook, or scheduled.
              </p>
            </div>

            {/* Nodes */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="text-green-600">⚡</span> Nodes
              </h3>
              <p className="text-gray-700 text-sm">
                Individual processing units in a workflow. Types include triggers, AI models, HTTP requests, and integrations.
              </p>
            </div>

            {/* Credentials */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="text-yellow-600">🔑</span> Credentials
              </h3>
              <p className="text-gray-700 text-sm">
                Securely stored API keys and access tokens. Encrypted at rest and used by nodes to authenticate with external services.
              </p>
            </div>

            {/* Executions */}
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="text-purple-600">📈</span> Executions
              </h3>
              <p className="text-gray-700 text-sm">
                Records of workflow runs with status, timing, errors, and outputs. Monitor performance and debug issues.
              </p>
            </div>
          </div>
        </div>

        {/* NODE REFERENCE */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">🔧 Node Reference</h2>

          <div className="space-y-4">
            {/* Triggers */}
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">Triggers</h3>
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">Manual Trigger</h4>
                  <p className="text-sm text-gray-600">Execute workflow by clicking "Execute Workflow" button.</p>
                </div>
                <div>
                  <h4 className="font-medium">Google Form Trigger</h4>
                  <p className="text-sm text-gray-600">Runs when Google Form is submitted. Use webhook URL in Google Apps Script.</p>
                </div>
                <div>
                  <h4 className="font-medium">Stripe Trigger</h4>
                  <p className="text-sm text-gray-600">Triggers on Stripe events (payments, subscriptions). Configure in Stripe dashboard.</p>
                </div>
              </div>
            </div>

            {/* AI Nodes */}
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">AI Models</h3>
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">OpenAI</h4>
                  <p className="text-sm text-gray-600">GPT-4o-mini. Requires OpenAI API key credential.</p>
                </div>
                <div>
                  <h4 className="font-medium">Anthropic Claude</h4>
                  <p className="text-sm text-gray-600">Claude 3.5 Haiku. Requires Anthropic API key.</p>
                </div>
                <div>
                  <h4 className="font-medium">Google Gemini</h4>
                  <p className="text-sm text-gray-600">Gemini 3.5 Preview Flash. Requires Google AI Studio API key.</p>
                </div>
                <div>
                  <h4 className="font-medium">DeepSeek</h4>
                  <p className="text-sm text-gray-600">DeepSeek Reasoner model. Requires DeepSeek API key.</p>
                </div>
              </div>
            </div>

            {/* Integration Nodes */}
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">Integrations</h3>
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="font-medium">HTTP Request</h4>
                  <p className="text-sm text-gray-600">Make GET/POST/PUT/PATCH/DELETE requests to any API endpoint.</p>
                </div>
                <div>
                  <h4 className="font-medium">Discord</h4>
                  <p className="text-sm text-gray-600">Send messages to Discord channels via webhook URLs.</p>
                </div>
                <div>
                  <h4 className="font-medium">Slack</h4>
                  <p className="text-sm text-gray-600">Post messages to Slack workspaces using incoming webhooks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEMPLATES */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">🎯 Example Workflows</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
              <h3 className="font-semibold mb-2">Customer Support Assistant</h3>
              <p className="text-sm text-gray-700 mb-3">
                Google Form → OpenAI → Slack notification
              </p>
              <p className="text-xs text-gray-600">
                When customer submits support form, analyze sentiment with AI, then notify team on Slack.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5 bg-green-50">
              <h3 className="font-semibold mb-2">Payment Processing</h3>
              <p className="text-sm text-gray-700 mb-3">
                Stripe → Anthropic → HTTP Request → Discord
              </p>
              <p className="text-xs text-gray-600">
                On successful payment, generate receipt with AI, update CRM via API, notify Discord.
              </p>
            </div>
          </div>
        </div>

        {/* VARIABLE SYSTEM */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">🔤 Variable System</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-medium mb-3">Using Variables Between Nodes</h3>
            <p className="text-gray-700 mb-4">
              Output from one node can be used as input in subsequent nodes using Handlebars syntax.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Simple Variable</h4>
                <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded">
                  {"{{myVariable}}"}
                </code>
                <p className="text-xs text-gray-600 mt-1">Access simple values like strings or numbers</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">JSON Variable</h4>
                <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded">
                  {"{{json myVariable}}"}
                </code>
                <p className="text-xs text-gray-600 mt-1">Convert objects to JSON strings</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Nested Properties</h4>
                <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded">
                  {"{{httpResponse.data.user.email}}"}
                </code>
                <p className="text-xs text-gray-600 mt-1">Access nested object properties</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-100">
              <h4 className="font-medium text-sm mb-2">Example Usage</h4>
              <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`HTTP Request (variable: "apiCall") → AI Prompt:
"Summarize this user data: {{json apiCall.httpResponse.data}}"

AI Output (variable: "summary") → Discord:
"New summary: {{summary.text}}"`}
              </pre>
            </div>
          </div>
        </div>

        {/* WEBHOOKS */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">🌐 Webhooks</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-medium mb-3">Google Form Webhook</h3>
              <p className="text-sm text-gray-700 mb-3">
                Available variables from Google Form submissions:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li><code className="bg-gray-100 px-1">{"{{googleForm.respondentEmail}}"}</code></li>
                <li><code className="bg-gray-100 px-1">{"{{googleForm.responses['Question']}}"}</code></li>
                <li><code className="bg-gray-100 px-1">{"{{googleForm.timestamp}}"}</code></li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-medium mb-3">Stripe Webhook</h3>
              <p className="text-sm text-gray-700 mb-3">
                Available variables from Stripe events:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li><code className="bg-gray-100 px-1">{"{{stripe.amount}}"}</code></li>
                <li><code className="bg-gray-100 px-1">{"{{stripe.customerId}}"}</code></li>
                <li><code className="bg-gray-100 px-1">{"{{stripe.eventType}}"}</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* TROUBLESHOOTING */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">🔍 Troubleshooting</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Common Issues</h3>
              
              <div className="ml-4 space-y-4">
                <div>
                  <h4 className="font-medium">"Credential not found" error</h4>
                  <p className="text-sm text-gray-600">
                    Ensure the credential exists and is of the correct type (OpenAI credential for OpenAI node).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Workflow execution stuck</h4>
                  <p className="text-sm text-gray-600">
                    Check the execution details page for error messages. Common causes: API rate limits, invalid API keys, or network issues.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Variables not passing between nodes</h4>
                  <p className="text-sm text-gray-600">
                    Verify node connections are properly established. Check variable names match exactly.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Debugging Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li>Use the Execution History to see detailed logs</li>
                <li>Test AI prompts with simple text first</li>
                <li>Check webhook URLs are correctly configured</li>
                <li>Verify API credentials have sufficient permissions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API REFERENCE */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">⚙️ API Reference</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-medium mb-3">REST API Endpoints</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Execute Workflow</h4>
                <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded">
                  POST /api/inngest
                </code>
                <p className="text-xs text-gray-600 mt-1">Trigger workflow execution via Inngest</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Webhooks</h4>
                <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded">
                  POST /api/webhooks/google-form?workflowId=xxx
                </code>
                <br />
                <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded mt-1">
                  POST /api/webhooks/stripe?workflowId=xxx
                </code>
                <p className="text-xs text-gray-600 mt-1">External service webhook endpoints</p>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="fade-item mb-12">
          <h2 className="text-2xl font-semibold mb-4">💬 Support</h2>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium mb-3">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Contact our support team for assistance with:
            </p>
            <ul className="text-gray-600 space-y-2 ml-4">
              <li>Technical issues with workflow execution</li>
              <li>Integration setup with third-party services</li>
              <li>Billing and subscription questions</li>
              <li>Feature requests and suggestions</li>
            </ul>
            <p className="mt-4 text-gray-700">
              Email: <a href="mailto:hello@vivelune.com" className="underline">hello@vivelune.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-300 px-6 py-10 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Vivelune</span>
          <div className="flex gap-6 flex-wrap">
            <Link href="/privacy" className="hover:text-gray-900 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition">
              Terms of Service
            </Link>
            <Link href="/agreement" className="hover:text-gray-900 transition">
              User Agreement
            </Link>
            <Link href="/docs" className="hover:text-gray-900 transition font-semibold">
              Docs
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}