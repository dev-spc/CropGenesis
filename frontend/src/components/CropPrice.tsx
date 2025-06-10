import React, { useEffect, useState } from "react";
import axios from "axios";

export const CropPrice = () => {
  const [cropPrices, setCropPrices] = useState<any>([]);

  useEffect(() => {
    axios.post("http://0.0.0.0:8000/get-market-price", {
      state: "Uttar Pradesh",
      district: "Siddharth Nagar"
    })
      .then((res) => {
        if (Array.isArray(res.data.records)) {
          // Map API data to expected structure
          const prices = res.data.records.map((item: any) => ({
            name: item.commodity,
            price: `₹${item.modal_price}`
          }));
          setCropPrices(prices);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden shadow-lg">
      <div className="h-10 flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-8">
          {cropPrices.map((crop: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm font-medium">
              <span className="text-yellow-300 font-semibold">{crop.name}</span>
              <span className="text-white">{crop.price} / quintal</span>
              <span className="text-gray-300 mx-2">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};