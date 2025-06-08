
export const CropPrice = () => {
  const cropPrices = [
    { name: "Wheat", price: "₹2,450", change: "+2.3%", positive: true },
    { name: "Rice", price: "₹3,200", change: "-1.8%", positive: false },
    { name: "Cotton", price: "₹6,800", change: "+4.1%", positive: true },
    { name: "Sugarcane", price: "₹380", change: "+0.8%", positive: true },
    { name: "Corn", price: "₹1,920", change: "-2.1%", positive: false },
    { name: "Soybean", price: "₹4,650", change: "+3.5%", positive: true },
    { name: "Barley", price: "₹1,750", change: "+1.2%", positive: true },
    { name: "Mustard", price: "₹5,420", change: "-0.9%", positive: false },
    { name: "Turmeric", price: "₹14,200", change: "+5.2%", positive: true },
    { name: "Chili", price: "₹18,500", change: "+2.7%", positive: true },
    { name: "Onion", price: "₹45", change: "-8.3%", positive: false },
    { name: "Tomato", price: "₹38", change: "+12.4%", positive: true }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden shadow-lg">
      <div className="h-10 flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-8">
          {cropPrices.map((crop, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm font-medium">
              <span className="text-yellow-300 font-semibold">{crop.name}</span>
              <span className="text-white">{crop.price}</span>
              <span className={`font-bold ${crop.positive ? 'text-green-400' : 'text-red-400'}`}>
                {crop.change}
              </span>
              <span className="text-gray-300 mx-2">|</span>
            </div>
          ))}
          {cropPrices.map((crop, index) => (
            <div key={`dup-${index}`} className="flex items-center space-x-2 text-sm font-medium">
              <span className="text-yellow-300 font-semibold">{crop.name}</span>
              <span className="text-white">{crop.price}</span>
              <span className={`font-bold ${crop.positive ? 'text-green-400' : 'text-red-400'}`}>
                {crop.change}
              </span>
              <span className="text-gray-300 mx-2">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};