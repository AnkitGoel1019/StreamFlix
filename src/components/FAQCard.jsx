const FAQCard = ({ question, answer }) => {
  return (
    <div className="bg-gray-800 text-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{question}</h3>
      <p className="text-sm opacity-80 mt-2">{answer}</p>
    </div>
  );
};

export default FAQCard;
