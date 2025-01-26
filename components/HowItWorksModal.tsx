import React from 'react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string[];
  icons: React.ReactNode[];
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  icons,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">{title}</h2>
        <div className="flex flex-col space-y-4">
          {content.map((text, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 text-blue-600">
                {icons[index]}
              </div>
              <p className="text-left">{text}</p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HowItWorksModal;
