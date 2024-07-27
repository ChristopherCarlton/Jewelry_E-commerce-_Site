"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Header from "./header";
import Footer from "./footer";
import LoadingSpinner from "../components/LoadingSpinner";

// Define the type for the items
type Item = {
  id: number;
  name: string;
  link: string;
};

function MainComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching items from Supabase...");
      const response = await supabase
        .from("summerItems")
        .select("*");

      console.log("Supabase response:", response);

      if (response.error) {
        console.error("Error fetching items:", response.error);
      } else {
        console.log("Fetched items:", response.data);
        const items = response.data as Item[];
        setItems(items);

        // Preload images
        const imagePromises = items.map((item) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.src = getImageUrl(item.id);
            img.onload = () => resolve();
            img.onerror = () => reject();
          })
        );

        Promise.all(imagePromises)
          .then(() => {
            console.log("All images preloaded");
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error preloading images:", error);
            setIsLoading(false);
          });
      }
    };

    fetchItems();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getImageUrl = (id: number) => {
    const url = `https://psxmuvbtzgqsynfweilj.supabase.co/storage/v1/object/public/product-images/summer-item-${id}.png`;
    console.log(`Image URL for item ${id}:`, url);
    return url;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-[#FFC0CB] min-h-screen">
      <Header />
      
      <section className="relative">
        <img
          src="/images/ANG2.png"
          alt="Summer Giveaway featuring beach accessories and tropical scenery"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </section>

      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.length === 0 && <p>No items found.</p>}
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <a href={item.link}>
                <img
                  src={getImageUrl(item.id)}
                  alt={`Summer item: ${item.name} - perfect for beach days`}
                  className="w-full h-64 object-cover"
                />
              </a>
              <div className="p-4">
                <p className="text-[#FF69B4] font-semibold font-roboto text-xl">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainComponent;
