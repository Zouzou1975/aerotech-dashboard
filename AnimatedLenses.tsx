export function AnimatedLenses() {
  return (
    <div className="lenses" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => <span key={i} className={`lens lens-${i + 1}`} />)}
    </div>
  );
}
