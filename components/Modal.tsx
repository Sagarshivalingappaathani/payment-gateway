// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, contact: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contact, setContact] = React.useState("");

  const handleSubmit = () => {
    console.log("Submitting user details:", { name, email, contact });
    onSubmit(name, email, contact);
    setName(""); 
    setEmail(""); 
    setContact(""); 
    onClose(); 
  };
  
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Enter Your Details</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-3 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex justify-between">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="border border-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
