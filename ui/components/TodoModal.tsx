// Modal.tsx
import React, { useEffect } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { useEditTodoViewModel } from '../view_models/edit_todo_view_model';
import ReactPortal from './ReactPortal';


interface ModalProps {
  title: string;
  description: string;
  onClose: () => void;
}


const Modal: React.FC<ModalProps> = ({ title, description, onClose }) => {
  const isModalOpen = useEditTodoViewModel(state => state.isModalOpen);
  // Derive the function of the background of the modal.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return (): void => {
      document.body.style.overflow = 'unset';
    };
  },[isModalOpen])
  // close modal when escape key is pressed
  useEffect(() => {
    const closeOnEscapeKey = (e:KeyboardEvent) => e.key === "Escape" ? onClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);

  if (!isModalOpen) return null;

  return (
    // <ReactPortal wrapperId='react-portal-modal-container'>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {/* バツボタン */}
        <div className="absolute right-0 -top-10 h-10 w-10 hover:cursor-pointer">
          <RxCross1 className="h-full w-full" />
        </div>
        <div className="flex h-full w-full flex-col bg-white">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-4">{description}</p>
          <button 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    // </ReactPortal>
  );
};

export default Modal;
