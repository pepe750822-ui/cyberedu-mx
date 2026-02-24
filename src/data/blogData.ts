export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    category: string;
    image: string;
    slug: string;
    tags: string[];
}

export const blogPosts: BlogPost[] = [
    {
        id: "convocatoria-ecoems-2026",
        title: "¡Ya salió! Convocatoria ECOEMS 2026: Fechas y Requisitos",
        excerpt: "La convocatoria oficial del ECOEMS 2026 ha sido publicada. Descubre las fechas de registro, modalidades y requisitos para asegurar tu lugar.",
        content: `
      <h2>¡Atención Aspirantes! La Convocatoria ECOEMS 2026 ya está aquí</h2>
      <p>El Espacio de Coordinación de la Educación Media Superior (ECOEMS) ha publicado oficialmente las fechas para el proceso de ingreso a bachillerato 2026 en la CDMX y Zona Metropolitana. Este sistema busca democratizar el acceso a la educación media superior.</p>
      
      <h3>Fechas Clave que NO debes olvidar:</h3>
      <ul>
        <li><strong>Publicación de la Convocatoria:</strong> 23 de febrero de 2026.</li>
        <li><strong>Registro en línea:</strong> Del 17 de marzo al 14 de abril de 2026 a través de <a href="https://miderechomilugar.gob.mx/">miderechomilugar.gob.mx</a>.</li>
        <li><strong>Examen Digital:</strong> 20, 21, 27 y 28 de junio de 2026.</li>
        <li><strong>Publicación de Resultados:</strong> 18 de agosto de 2026.</li>
      </ul>

      <h3>Requisitos Principales:</h3>
      <ol>
        <li>Generar tu <strong>Llave MX</strong> en www.llave.gob.mx.</li>
        <li>Promedio mínimo de <strong>7.0</strong> para opciones de la UNAM (ENP/CCH) e IPN (CECyT).</li>
        <li>CURP vigente y certificado de secundaria (o constancia de estudio).</li>
      </ol>

      <h3>Modalidades de Participación:</h3>
      <p>El ECOEMS ofrece tres modalidades para facilitar tu elección:</p>
      <ul>
        <li><strong>Modalidad 1:</strong> Instituciones sin examen adicional (Bachilleres, CONALEP).</li>
        <li><strong>Modalidad 2:</strong> Instituciones con examen de admisión (UNAM, IPN).</li>
        <li><strong>Modalidad 3:</strong> Combinación de ambas opciones.</li>
      </ul>

      <p>¡Empieza a estudiar con nuestros simuladores inteligentes hoy mismo!</p>
    `,
        date: "23 Feb 2026",
        author: "Administración CyberEdu",
        category: "Oficial",
        image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=800&auto=format&fit=crop",
        slug: "convocatoria-ecoems-2026",
        tags: ["ECOEMS", "Convocatoria", "Fechas", "2026"]
    },
    {
        id: "temario-ecoems-2026-analisis",
        title: "Guía de Temas: ¿Qué vendrá en el examen digital ECOEMS?",
        excerpt: "Analizamos el temario oficial del ECOEMS 2026. Desde Habilidad Verbal hasta Ciencias, prepárate para el examen del futuro.",
        content: `
      <h2>Análisis del Temario ECOEMS 2026</h2>
      <p>El examen ECOEMS 2026 será 100% digital asistido por tecnología, evaluando los conocimientos esenciales de la educación secundaria.</p>
      
      <h3>Áreas de Evaluación:</h3>
      <ul>
        <li><strong>Habilidades:</strong> Verbal (razonamiento, comprensión lectora) y Matemática (series, lógica).</li>
        <li><strong>Matemáticas:</strong> Aritmética, Álgebra elemental y Geometría.</li>
        <li><strong>Ciencias Experimentales:</strong> Biología, Física y Química.</li>
        <li><strong>Ciencias Sociales:</strong> Historia Universal, Historia de México y Geografía.</li>
        <li><strong>Humanidades:</strong> Formación Cívica y Ética.</li>
      </ul>

      <h3>Consejos de Preparación:</h3>
      <p>Dado que el examen requiere cámara y micrófono para la supervisión remota, es vital familiarizarse con interfaces digitales.</p>
      <p>Nuestros 91 videos están diseñados exactamente para cubrir cada uno de estos temas con explicaciones claras y simuladores de práctica.</p>
    `,
        date: "24 Feb 2026",
        author: "Coordinación Académica",
        category: "Guías",
        image: "https://images.unsplash.com/photo-1454165833762-0102409830e7?q=80&w=800&auto=format&fit=crop",
        slug: "temario-ecoems-2026",
        tags: ["Temario", "Examen", "Consejos", "Guía"]
    },
    {
        id: "diferencias-comipems-ecoems",
        title: "ECOEMS vs COMIPEMS: Entiende el Cambio en 2026",
        excerpt: "¿Cuáles son las diferencias reales entre el antiguo sistema y el nuevo ECOEMS? Te explicamos el nuevo sistema de derecho a lugar.",
        content: `
      <h2>El Fin de una Era: De COMIPEMS a ECOEMS</h2>
      <p>A partir del 2025, el sistema de asignación en la Zona Metropolitana evolucionó. Aquí te explicamos los pilares del ECOEMS.</p>
      
      <h3>Las 5 Diferencias Clave:</h3>
      <ol>
        <li><strong>Derecho a Lugar:</strong> El enfoque cambia de una competencia por puntaje a una garantía de espacio educativo.</li>
        <li><strong>Examen Digital:</strong> Se eliminan las hojas de óvalos, migrando a una plataforma tecnológica supervisada.</li>
        <li><strong>Modalidades:</strong> Mayor flexibilidad para elegir opciones con o sin examen.</li>
        <li><strong>Asignación por Cercanía:</strong> En ciertas modalidades, la ubicación de tu domicilio pesa más en la asignación.</li>
        <li><strong>Tecnología:</strong> El uso de la Llave MX como identidad digital obligatoria.</li>
      </ol>
    `,
        date: "24 Feb 2026",
        author: "Redacción CyberEdu",
        category: "Noticias",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
        slug: "ecoems-vs-comipems",
        tags: ["ECOEMS", "COMIPEMS", "Cambios", "Educación"]
    }
];
