import { useEffect, useState } from "react";

function PageTransition({ children, transitionKey }) {
  return (
    <div
      key={transitionKey}
      className="flex-1 flex flex-col min-w-0 h-full overflow-hidden animate-page"
    >
      {children}
    </div>
  );
}

export default PageTransition;
