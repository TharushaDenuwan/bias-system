"use client";
import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";
import Link from "next/link";
import { useState } from "react";
import PageLayout from "../../../components/pagelayout_legal/pagelayout"; // Adjust path as needed

const faqData = [
  {
    category: "General",
    question: "What is your return policy?",
    answer:
      "You can return most items within 30 days of delivery. Please ensure the items are in original condition.",
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer:
      "Go to the login page and click on 'Forgot password'. Follow the instructions sent to your email.",
  },
  {
    category: "Billing",
    question: "When will I be charged?",
    answer:
      "You will be charged immediately upon confirming your order unless you are using a deferred payment method.",
  },
  {
    category: "Shipping & Returns",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Expedited options are available at checkout.",
  },
  {
    category: "Technical Support",
    question: "Why am I having trouble logging in?",
    answer:
      "Ensure your username and password are correct. Try resetting your password or clearing your browser cache.",
  },
];

const categories = [
  "All",
  "General",
  "Account",
  "Billing",
  "Shipping & Returns",
  "Technical Support",
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function toggleExpand(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  return (
    <div>
      <Navbar />
      <PageLayout title="Frequently Asked Questions">
        {/* Search Bar */}
        <div className="mb-6 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search for an answer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border transition ${
                activeCategory === cat
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.length === 0 && (
            <p className="text-center text-gray-500">No results found.</p>
          )}
          {filteredFaqs.map((faq, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div
                key={i}
                className="border border-gray-300 rounded-md bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleExpand(i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-gray-800 hover:bg-blue-50 rounded-md focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <span className="text-blue-700 font-bold text-2xl select-none">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 text-gray-700">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA - if you want it here as well */}
        <div className="mt-10 text-center max-w-4xl mx-auto">
          <Link
            href="/contact"
            className="inline-block px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
          >
            Still need help? Contact us
          </Link>
        </div>
      </PageLayout>
      <Footer />
    </div>
  );
}
