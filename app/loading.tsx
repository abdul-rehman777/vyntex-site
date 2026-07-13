/**
 * Root loading state. A calm, brand-consistent skeleton rather than a spinner —
 * it holds the shape of the page so the layout does not jump when content
 * arrives. The pulse is gated behind motion-safe.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-vx-bg pt-[72px]">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 lg:px-8">
        <div className="flex flex-col gap-6" aria-hidden>
          <div className="h-3 w-32 rounded-full bg-vx-bg2 motion-safe:animate-pulse" />
          <div className="h-12 w-3/4 rounded-xl bg-vx-bg2 motion-safe:animate-pulse" />
          <div className="h-12 w-1/2 rounded-xl bg-vx-bg2 motion-safe:animate-pulse" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl border border-[rgba(14,165,233,0.10)] bg-vx-bg2 motion-safe:animate-pulse"
              />
            ))}
          </div>
        </div>
        <p className="sr-only" role="status">
          Loading · Cargando
        </p>
      </div>
    </div>
  );
}
