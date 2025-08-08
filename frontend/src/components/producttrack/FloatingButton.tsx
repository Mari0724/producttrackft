import { MdAdd } from "react-icons/md";

interface FloatingButtonProps {
  onAddProduct?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onAddProduct }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        className="bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
        onClick={onAddProduct}
      >
        <MdAdd size={24} />
      </button>
    </div>
  );
};

export default FloatingButton;