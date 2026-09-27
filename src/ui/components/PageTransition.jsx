import { useEffect, useState } from "react";

function PageTransition({ children, transitionKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    return () => cancelAnimationFrame(raf);
  }, [transitionKey]);

  return (
    <div
      className={`flex-1 flex min-w-0 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {children}
    </div>
  );
}

export default PageTransition;
