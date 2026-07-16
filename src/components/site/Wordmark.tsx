export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-[-0.02em] ${className}`}>
      Imperium<span className="text-taupe"> Motors</span>
    </span>
  );
}
