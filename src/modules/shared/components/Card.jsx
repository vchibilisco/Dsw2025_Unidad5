function Card({ children }) {
  return (
    <div className="bg-white border border-gray-300 p-4 rounded-xl">
      {children}
    </div>
  );
};

export default Card;
