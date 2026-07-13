"use client";

/**
 * Last-resort boundary: catches errors in the root layout itself, where the
 * normal error.tsx cannot render because the layout it depends on is the thing
 * that failed. It must therefore ship its own <html> and <body> and must not
 * import anything from the app.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050714",
          color: "#E8EAFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <p
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#38BDF8",
              margin: 0,
            }}
          >
            VYNTEX
          </p>
          <h1 style={{ fontSize: 22, marginTop: 24, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#7880A8", fontSize: 14, margin: 0 }}>
            Algo salió mal. Please reload the page, or contact info@vyntexusa.com
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              minHeight: 48,
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg,#0EA5E9,#22D3EE)",
              color: "#050714",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again · Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
