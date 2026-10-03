/**
 * Fixed page backdrop: a deep green-black gradient, a faint drifting grid and a
 * handful of slow particles. Purely decorative.
 */
const particles = [
  { left: "12%", top: "22%", size: 2, delay: "0s", duration: "9s" },
  { left: "78%", top: "14%", size: 1.5, delay: "2s", duration: "11s" },
  { left: "64%", top: "58%", size: 2, delay: "1s", duration: "10s" },
  { left: "22%", top: "72%", size: 1.5, delay: "3s", duration: "12s" },
  { left: "88%", top: "80%", size: 2, delay: "0.5s", duration: "9.5s" },
  { left: "42%", top: "36%", size: 1, delay: "4s", duration: "13s" },
  { left: "6%", top: "52%", size: 1, delay: "1.5s", duration: "10.5s" },
];

export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0b1a14_0%,#060b09_45%,#050807_100%)]" />
      <div className="absolute -top-[20%] left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,255,136,0.09),transparent)] blur-2xl" />
      <div className="absolute -right-[10%] top-[35%] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(0,201,167,0.06),transparent)] blur-2xl" />
      <div className="bg-grid absolute inset-0 animate-drift [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_20%,transparent_75%)]" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/70 animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            boxShadow: "0 0 8px rgba(0,255,136,0.6)",
            opacity: 0.5,
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
