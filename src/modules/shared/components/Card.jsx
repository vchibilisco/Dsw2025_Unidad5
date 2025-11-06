function Card({ children, className }) {
  return (
    <div className={`bg-white border border-gray-300 p-4 rounded-xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
