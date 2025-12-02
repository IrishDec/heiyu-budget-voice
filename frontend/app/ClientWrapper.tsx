"use client";

import { useState, useEffect } from "react";
import ContactForm from "./components/ContactForm";

export default function ClientWrapper() {
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const handler = () => setShowContact(true);
    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, []);

  return (
    <>
      {showContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <ContactForm onClose={() => setShowContact(false)} />
        </div>
      )}
    </>
  );
}

