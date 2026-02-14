"use client";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded w-80 max-w-full">
        {title && <h3 className="font-bold mb-2">{title}</h3>}
        {children}
        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
