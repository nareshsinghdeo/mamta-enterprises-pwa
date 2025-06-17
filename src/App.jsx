// Project: Mamta Enterprises Logistics Website (PWA + SEO Optimized)
// Tech Stack: React + Vite + Tailwind CSS (Frontend)

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

export default function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  const defaultBaseMap = {
    '1BHK': 1000,
    '2BHK': 1500,
    '3BHK': 2000,
    'Villa': 3000,
    'Small Office': 2500,
    'Medium Office': 3500,
    'Corporate Office': 5000,
    'Furniture': 1200,
    'Electronics': 1500,
    'Industrial Goods': 2500
  };

  const serviceSubTypes = {
    'Home Transport': ['1BHK', '2BHK', '3BHK', 'Villa'],
    'Office Shifting': ['Small Office', 'Medium Office', 'Corporate Office'],
    'Goods Transport': ['Furniture', 'Electronics', 'Industrial Goods']
  };

  const [basePrices, setBasePrices] = useState(defaultBaseMap);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: '',
    serviceType: 'Home Transport',
    subServiceType: '1BHK',
    estimatedCost: null,
    message: ''
  });

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'serviceType' && { subServiceType: serviceSubTypes[value][0] })
    }));
  };

  const handleEstimate = (e) => {
    e.preventDefault();
    const baseCost = basePrices[form.subServiceType] || 1000;
    const distanceFactor = form.pickup !== form.destination ? 1.5 : 1;
    const gst = 0.18 * baseCost;
    const cost = (baseCost * distanceFactor) + gst;
    setForm({ ...form, estimatedCost: cost });
  };

  const handleGenerateBill = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Mamta Enterprises - Transport Bill", 20, 20);
    doc.setFontSize(12);
    doc.text(`Customer Name: ${form.name}`, 20, 40);
    doc.text(`Phone: ${form.phone}`, 20, 50);
    doc.text(`Pickup: ${form.pickup}`, 20, 60);
    doc.text(`Destination: ${form.destination}`, 20, 70);
    doc.text(`Service Type: ${form.serviceType}`, 20, 80);
    doc.text(`Sub Type: ${form.subServiceType}`, 20, 90);
    const base = parseFloat((form.estimatedCost / 1.18).toFixed(2));
    const gst = parseFloat((form.estimatedCost - base).toFixed(2));
    doc.text(`Base Cost: ₹${base}`, 20, 100);
    doc.text(`GST (18%): ₹${gst}`, 20, 110);
    doc.text(`Total: ₹${form.estimatedCost}`, 20, 120);
    doc.save("Mamta_Invoice.pdf");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  const handleBasePriceChange = (key, value) => {
    setBasePrices(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const sliderImages = [
    "https://source.unsplash.com/featured/?truck",
    "https://source.unsplash.com/featured/?moving",
    "https://source.unsplash.com/featured/?logistics"
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Helmet>
        <title>Mamta Enterprises | Home Transport & Logistics in Jamshedpur</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="description" content="Mamta Enterprises offers affordable and reliable local home shifting, office moving, and goods transport services in Jamshedpur." />
        <meta name="keywords" content="home transport Jamshedpur, logistics Jamshedpur, office shifting, house movers, goods transport" />
        <meta name="author" content="Mamta Enterprises" />
        <link rel="manifest" href="/manifest.json" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Mamta Enterprises",
            "image": "https://source.unsplash.com/featured/?logistics",
            "@id": "",
            "url": "https://mamta-enterprises-pwa.vercel.app/",
            "telephone": "+91-XXXXXXXXXX",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Jamshedpur",
              "addressLocality": "Jamshedpur",
              "postalCode": "831001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 22.8046,
              "longitude": 86.2029
            },
            "sameAs": [
              "https://www.google.com/maps?q=mamta+enterprises+jamshedpur"
            ]
          }
        `}</script>
      </Helmet>

      <header className="flex items-center justify-between p-4 bg-blue-950 text-white shadow">
        <img src="/logo-mamta-enterprises.png" alt="Mamta Enterprises Logo" className="h-14 w-14 rounded animate-pulse" />
        <div>
          <h1 className="text-2xl font-bold">Mamta Enterprises</h1>
          <p className="text-sm">Jamshedpur’s Local Transport Expert</p>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <section className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">🛠 Admin: Update Service Prices</h2>
          {Object.keys(basePrices).map((key) => (
            <div key={key} className="mb-2">
              <label className="mr-2 font-semibold">{key}</label>
              <input
                type="number"
                value={basePrices[key]}
                onChange={(e) => handleBasePriceChange(key, e.target.value)}
                className="border p-1 w-24"
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
