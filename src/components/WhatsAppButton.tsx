import React, { useState } from "react";

const WHATSAPP_NUMBER = "5523269241";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "¡Hola! Vengo de CyberEdu MX y tengo una pregunta 👋"
);
const WHATSAPP_URL = `https://wa.me/52${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const WhatsAppButton: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Contactar por WhatsApp"
      style={{
        position: "fixed",
        bottom: "6rem",
        left: "0.25rem",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}
    >
      {/* Tooltip label */}
      <span
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-6px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          background: "#075e54",
          color: "#fff",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "0.3rem 0.65rem",
          borderRadius: "9999px",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
          pointerEvents: "none",
        }}
      >
        ¿Necesitas ayuda?
      </span>

      {/* WhatsApp circle button */}
      <span
        style={{
          width: "3.25rem",
          height: "3.25rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: hovered
            ? "0 0 0 6px rgba(37,211,102,0.2), 0 8px 24px rgba(0,0,0,0.4)"
            : "0 4px 16px rgba(0,0,0,0.35)",
          transition: "box-shadow 0.25s ease",
          flexShrink: 0,
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="26"
          height="26"
          fill="#ffffff"
        >
          <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.348.636 4.612 1.84 6.591L2.667 29.333l6.92-1.813A13.26 13.26 0 0 0 16.003 29.333C23.369 29.333 29.333 23.363 29.333 16S23.369 2.667 16.003 2.667zm0 24.267a11.02 11.02 0 0 1-5.616-1.535l-.403-.24-4.103 1.076 1.095-3.997-.261-.41A10.993 10.993 0 0 1 5.04 16c0-6.048 4.921-10.96 10.963-10.96C22.048 5.04 26.96 9.952 26.96 16s-4.912 10.934-10.957 10.934zm6.015-8.195c-.33-.166-1.952-.963-2.255-1.073-.303-.11-.524-.166-.745.166-.22.33-.855 1.073-1.047 1.294-.193.22-.385.248-.715.083-.33-.166-1.393-.513-2.653-1.637-.98-.875-1.641-1.955-1.834-2.285-.193-.33-.021-.508.145-.672.15-.148.33-.385.496-.578.166-.192.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.166-.745-1.795-1.02-2.458-.268-.644-.54-.556-.745-.566-.192-.01-.413-.013-.635-.013-.22 0-.578.083-.882.413-.303.33-1.157 1.13-1.157 2.76 0 1.628 1.185 3.204 1.35 3.425.166.22 2.33 3.561 5.647 4.994.789.34 1.405.543 1.885.695.792.252 1.513.216 2.083.131.635-.095 1.953-.797 2.229-1.567.275-.77.275-1.43.193-1.567-.083-.138-.303-.22-.633-.386z"/>
        </svg>
      </span>

      {/* Pulsing ring */}
      <style>{`
        @keyframes wa-pulse {
          0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
      `}</style>
    </a>
  );
};

export default WhatsAppButton;
