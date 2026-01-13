import { useEffect, useState } from "react";
import FAQCard from "./FAQCard";
import Heading from "./Heading";

const FAQList = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ks-api/v1/common/faq?source=Farmer", {
      method: "GET",
      headers: {
        accept: "/",
        preferredLanguageCode: "en"
      }
    })
      .then((res) => res.json())
      .then((data) => {
       console.log(data);
      setFaqData(data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching FAQ:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col justify-center">

      <Heading
        title="किसान FAQ"
        subtitle="कृषि से संबंधित आम प्रश्न और उनके उत्तर"
      />

      {loading ? (
        <p className="text-white text-center text-lg">Loading...</p>
      ) : (
        <div className="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {faqData.map((item, index) => (
            <FAQCard key={index} {...item} />
          ))}
        </div>
      )}

    </div>
  );
};

export default FAQList;