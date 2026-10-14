import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalCount, setModalCount] = useState(0);

  const openModal = () => setModalCount((c) => c + 1);
  const closeModal = () => setModalCount((c) => Math.max(0, c - 1));

  return (
    <ModalContext.Provider
      value={{ isModalOpen: modalCount > 0, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
