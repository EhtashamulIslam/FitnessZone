import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Daisynav from "./components/Daisynav/Daisynav";
import Navbar from "./components/Navbar/Navbar";
import PricingOption from "./components/PricingOption/PricingOption";
import PlanDetails from "./components/PlanDetails/PlanDetails";
import Cart from "./components/Cart/Cart";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (plan) => {
    setCartItems(prev => {
      if (prev.some(p => p.id === plan.id)) return prev;
      return [...prev, plan];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <BrowserRouter>
      <header>
        <Navbar />
        <Daisynav />
      </header>

      <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={
            <>
              <h1 style={{ textAlign: "center", marginBottom: 12 }}>FitZone Pricing</h1>
              <PricingOption addToCart={handleAddToCart} />
              <section style={{ marginTop: 40 }}>
                <h2 style={{ textAlign: "center" }}>Your Cart</h2>
                <Cart items={cartItems} onRemove={handleRemoveFromCart} />
              </section>
            </>
          } />

          <Route path="/plans/:id" element={<PlanDetails addToCart={handleAddToCart} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
