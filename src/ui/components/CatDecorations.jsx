export function PawFloat({
  size = 24,
  rotate = 0,
  color,
  opacity = 0.15,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ transform: `rotate(${rotate}deg)`, color }}
      className={`pointer-events-none ${className}`}
      opacity={opacity}
    >
      <ellipse cx="7" cy="9" rx="2" ry="3" />
      <ellipse cx="12" cy="6.5" rx="2" ry="3" />
      <ellipse cx="17" cy="9" rx="2" ry="3" />
      <ellipse cx="19.5" cy="14" rx="1.5" ry="2.2" />
      <path d="M12 12c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3 3.5 3 1 0 2-.5 3-.5s2 .5 3 .5c2 0 3.5-1 3.5-3C18.5 14.5 15.5 12 12 12z" />
    </svg>
  );
}

export function WhiskerLine({ width = 60, className = "" }) {
  return (
    <svg
      width={width}
      height="12"
      viewBox="0 0 60 12"
      fill="none"
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M2 6 Q 20 2, 58 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M2 8 Q 20 5, 58 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}

export function CatEars({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pointer-events-none ${className}`}
    >
      <path d="M4 12 L6 4 L11 9" />
      <path d="M20 12 L18 4 L13 9" />
    </svg>
  );
}

export function ScatteredPaws({ color = "currentColor" }) {
  return (
    <>
      <PawFloat
        size={20}
        rotate={-25}
        color={color}
        opacity={0.1}
        className="absolute top-6 end-8 hidden sm:block"
      />
      <PawFloat
        size={14}
        rotate={15}
        color={color}
        opacity={0.08}
        className="absolute bottom-12 start-6 hidden sm:block"
      />
      <PawFloat
        size={16}
        rotate={-40}
        color={color}
        opacity={0.06}
        className="absolute top-1/2 end-4 hidden lg:block"
      />
    </>
  );
}
