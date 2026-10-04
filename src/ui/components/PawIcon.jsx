function PawIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <ellipse cx="7" cy="9" rx="2" ry="3" />
      <ellipse cx="12" cy="6.5" rx="2" ry="3" />
      <ellipse cx="17" cy="9" rx="2" ry="3" />
      <ellipse cx="19.5" cy="14" rx="1.5" ry="2.2" />
      <path d="M12 12c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3 3.5 3 1 0 2-.5 3-.5s2 .5 3 .5c2 0 3.5-1 3.5-3C18.5 14.5 15.5 12 12 12z" />
    </svg>
  );
}

export default PawIcon;
