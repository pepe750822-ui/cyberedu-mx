<template>
  <div>
    <!-- Navigation Bar (Replicating original design, Vue reactive) -->
    <div class="nav-bar">
      <div class="nav-links">
        <a href="dashboard.html" class="nav-btn"><i class="fas fa-th"></i> Portal Estratégico</a>
        <div class="theme-toggle" @click="toggleTheme"><i :class="['fas', isDarkMode ? 'fa-sun' : 'fa-moon']"></i></div>
      </div>
      <div class="nav-links">
        <!-- Will be dynamic later, using simple hardcoded for now -->
        <a href="#/capitulo/1" :class="['nav-btn', { 'disabled': currentChapter <= 1 }]"><i class="fas fa-chevron-left"></i> Anterior</a>
        <a href="#/capitulo/2" :class="['nav-btn', { 'disabled': currentChapter >= 11 }]">Siguiente <i class="fas fa-chevron-right"></i></a>
      </div>
    </div>

    <main>
      <!-- Main Content Area - Placeholder for ChapterView -->
      <h1 class="placeholder-h1" style="max-width: 21cm; margin: 40px auto; padding: 0 2cm;">
        Bienvenido al Manual Digital ECOEMS 2026 (Vue App)
      </h1>
      <p style="max-width: 21cm; margin: 20px auto; padding: 0 2cm;">
        Esta es la nueva aplicación moderna del manual. El contenido de los capítulos será migrado a componentes Vue.
        <br>
        **Próximo paso:** Extraer datos del capítulo 1 y crear los componentes.
      </p>
    </main>

    <!-- Floating Action Button (Contact) -->
    <div class="fab-contact">
        <div id="fab-menu" class="fab-menu" :style="{ display: fabMenuOpen ? 'flex' : 'none' }">
            <a href="https://wa.me/525523269241" target="_blank" style="background:#25D366;"><i class="fab fa-whatsapp"></i></a>
            <a href="mailto:JoseLuisGlez@cyberedumx.com" style="background:#0078D4;"><i class="fas fa-envelope"></i></a>
        </div>
        <div class="fab-btn" @click="toggleFAB"><i class="fas fa-headset"></i></div>
    </div>

    <!-- Footer Nav -->
    <div style="max-width: 21cm; margin: 20px auto 30px; display: flex; justify-content: space-between; font-family: 'Montserrat', sans-serif;">
        <a href="#/capitulo/1" style="text-decoration:none; color:var(--primary-color); font-weight:bold;" class="">
            <i class="fas fa-arrow-left"></i> Capítulo Anterior
        </a>
        <a href="dashboard.html" style="text-decoration:none; color:var(--primary-color); font-weight:bold;">
            <i class="fas fa-th"></i> Portal Estratégico
        </a>
        <a href="#/capitulo/2" style="text-decoration:none; color:var(--primary-color); font-weight:bold;" class="">
            Capítulo Siguiente <i class="fas fa-arrow-right"></i>
        </a>
    </div>

    <!-- Ecosystem Links -->
    <div style="max-width: 21cm; margin: 0 auto 100px; text-align: center; font-family: 'Montserrat', sans-serif; color: #777; font-size: 0.9em;">
        <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;">
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <a href="https://cyberedumx.com" target="_blank" style="color: inherit; text-decoration: none;">cyberedumx.com</a>
            <a href="../../ecoems2026.php" style="color: inherit; text-decoration: none;">Plataforma ECOEMS</a>
            <a href="https://www.udemy.com/course/ecoems2026conia/" target="_blank" style="color: inherit; text-decoration: none;">Curso Udemy</a>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false);
const fabMenuOpen = ref(false);
const currentChapter = ref(1); // Placeholder for dynamic chapter number

// Theme logic
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// FAB logic
const toggleFAB = () => {
  fabMenuOpen.value = !fabMenuOpen.value;
};

// Initialize theme on mount
onMounted(() => {
  if (localStorage.getItem('theme') === 'dark') {
    isDarkMode.value = true;
    document.body.classList.add('dark-mode');
  }
});
</script>

<style scoped>
/* Scoped styles for App.vue (mainly layout and nav) */

/* Navigation Bar */
.nav-bar { 
    position: sticky; 
    top: 0; 
    background: var(--nav-bg); 
    color: white; 
    padding: 10px 20px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    z-index: 100; 
    box-shadow: 0 2px 10px rgba(0,0,0,0.2); 
    font-family: 'Montserrat', sans-serif; 
}
.nav-links { 
    display: flex; 
    gap: 15px; 
    align-items: center; 
}
.nav-btn { 
    color: white; 
    text-decoration: none; 
    padding: 8px 15px; 
    border-radius: 5px; 
    background: rgba(255,255,255,0.1); 
    transition: all 0.3s; 
    font-size: 0.9em; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
}
.nav-btn:hover { 
    background: var(--primary-color); 
    color: var(--secondary-color); 
}
.nav-btn.disabled { 
    opacity: 0.3; 
    pointer-events: none; 
}

.theme-toggle { 
    cursor: pointer; 
    padding: 8px; 
    border-radius: 50%; 
    background: rgba(255,255,255,0.1); 
    transition: background 0.3s; 
}
.theme-toggle:hover { 
    background: rgba(255,255,255,0.2); 
}

/* Floating Action Button */
.fab-contact { 
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    z-index: 1000; 
}
.fab-btn { 
    width: 50px; 
    height: 50px; 
    border-radius: 50%; 
    background: var(--primary-color); 
    color: white; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 20px; 
    cursor: pointer; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
    transition: transform 0.3s; 
}
.fab-btn:hover { 
    transform: rotate(15deg) scale(1.1); 
}
.fab-menu { 
    /* display is controlled by Vue v-bind style */
    margin-bottom: 10px; 
    flex-direction: column; 
    gap: 10px; 
}
.fab-menu a { 
    width: 40px; 
    height: 40px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: white; 
    text-decoration: none; 
    font-size: 18px; 
}

/* Print Styles (Hiding UI elements for printing) */
@media print { 
    .nav-bar, .fab-contact { 
        display: none; 
    } 
}
</style>
