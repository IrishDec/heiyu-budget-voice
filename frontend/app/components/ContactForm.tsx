"use client";

import { useState } from "react";

interface ContactFormProps {
  onClose?: () => void;
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("");

    const formData = new FormData(e.target);

    // Web3Forms key
    formData.append("access_key", "4552e113-b8ed-4bce-9dde-ce725f43b955");

    // Identify app
    formData.append("app", "HeiyuBudget");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Success! We will be in touch soon.");
        e.target.reset();
        if (onClose) setTimeout(() => onClose(), 1500);
      } else {
        setResult("Something went wrong. Please try again later.");
      }
    } catch (error) {
      setResult("Connection error — please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#111] p-6 rounded-2xl border border-white/10 shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Send a Message</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 ml-1">NAME</label>
          <input
            required
            type="text"
            name="name"
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="John Doe"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 ml-1">EMAIL</label>
          <input
            required
            type="email"
            name="email"
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="john@example.com"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 ml-1">MESSAGE</label>
          <textarea
            required
            name="message"
            rows={4}
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white resize-none"
            placeholder="How can we help?"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-white/20 text-gray-300 py-3 rounded-xl hover:bg-white/10 text-sm"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-white text-black py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 text-sm font-bold"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <p
            className={`text-center text-sm mt-2 ${
              result.includes("Success") ? "text-green-400" : "text-red-400"
            }`}
          >
            {result}
          </p>
        )}
      </form>
    </div>
  );
}
