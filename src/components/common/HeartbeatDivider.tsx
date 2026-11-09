export function HeartbeatDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 overflow-hidden py-1 ${className}`}>
      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#0F3B34]/30 dark:via-[#389182]/30 to-[#0F3B34]/30" />
      <svg
        width="38"
        height="12"
        viewBox="0 0 38 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#D9673A] shrink-0"
      >
        <path
          d="M0 6H10L13 1L17 11L21 4L24 8L26 6H38"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#0F3B34]/30 dark:via-[#389182]/30 to-[#0F3B34]/30" />
    </div>
  );
}
