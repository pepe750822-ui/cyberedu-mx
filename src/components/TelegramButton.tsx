import React, { useState } from "react";

const TELEGRAM_USERNAME = "CyberEduMXBot";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

const TelegramButton: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Contactar por Telegram"
      className="fixed bottom-[6rem] left-1 z-[100] flex items-center gap-2 no-underline"
      style={{
        right: "auto",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",
        margin: 0,
        width: "auto"
      }}
    >
      {/* Telegram circle button */}
      <span
        style={{
          width: "3.25rem",
          height: "3.25rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0088cc 0%, #24a1de 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: hovered
            ? "0 0 0 6px rgba(0,136,204,0.2), 0 8px 24px rgba(0,0,0,0.4)"
            : "0 4px 16px rgba(0,0,0,0.35)",
          transition: "box-shadow 0.25s ease",
          flexShrink: 0,
        }}
      >
        {/* Telegram SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="#ffffff"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.18z"/>
        </svg>
      </span>

      {/* Tooltip label */}
      <span
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(6px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          background: "#0088cc",
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
        Chatea con el Bot
      </span>

      {/* Pulsing ring */}
      <style>{`
        @keyframes tg-pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,136,204,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(0,136,204,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,136,204,0); }
        }
      `}</style>
    </a>
  );
};

export default TelegramButton;
