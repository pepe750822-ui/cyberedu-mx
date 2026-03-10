

# Fase 4: Sistema de Auto-Diagnóstico y Monitoreo de la App

## Resumen

Implementar un sistema de diagnóstico integrado en el CyberAgent que detecta errores en la app en tiempo real, monitorea la salud de servicios (API, edge functions, almacenamiento), y ofrece sugerencias de auto-corrección al usuario. Se activa con el comando `/diagnostico` y también monitorea errores pasivamente.

## Componentes

### 1. Hook `useAppDiagnostics` (nuevo archivo)
- **Monitor de errores JS**: Captura `window.onerror` y `unhandledrejection` en un buffer circular (max 50 errores)
- **Health checks**: Prueba conectividad a la API (auth endpoint), edge function (`agent-chat`), y localStorage
- **Validación de datos**: Verifica integridad de datos locales (memoria del agente, historial, progreso de videos)
- **Detección de problemas comunes**: Sesión expirada, localStorage lleno, edge function caída, datos corruptos
- **Auto-corrección**: Para cada problema detectado, ofrece una acción correctiva (limpiar cache, refrescar sesión, reiniciar datos corruptos)

### 2. Comando `/diagnostico` en AITutor
- Ejecuta todos los health checks
- Muestra un `DiagnosticsCard` con resultados categorizados (OK / Warning / Error)
- Cada problema incluye botón de "Auto-corregir" que ejecuta la corrección

### 3. `DiagnosticsCard` (componente UI)
- Lista de checks con iconos de estado (verde/amarillo/rojo)
- Categorías: Conectividad, Datos Locales, Sesión, Rendimiento
- Botones de auto-corrección por problema
- Resumen general de salud de la app

### 4. Monitor pasivo en AITutor
- Si se acumulan 3+ errores JS, muestra un badge de alerta en el botón del agente
- Al abrir el chat con errores pendientes, sugiere ejecutar `/diagnostico`

## Archivos a modificar/crear

| Archivo | Acción |
|---|---|
| `src/hooks/useAppDiagnostics.ts` | Crear - hook con checks y auto-corrección |
| `src/components/AITutor.tsx` | Modificar - agregar comando `/diagnostico`, DiagnosticsCard, badge de errores |

## Checks incluidos

```text
┌──────────────────────────┬────────────────────────────────────┐
│ Check                    │ Auto-corrección                    │
├──────────────────────────┼────────────────────────────────────┤
│ API conectividad         │ Reintentar conexión                │
│ Edge function health     │ Reportar estado                    │
│ Sesión de usuario        │ Refrescar token                    │
│ localStorage espacio     │ Limpiar datos antiguos             │
│ Memoria del agente       │ Reiniciar memoria corrupta         │
│ Historial del chat       │ Limpiar historial corrupto         │
│ Progreso de videos       │ Verificar integridad               │
│ Errores JS recientes     │ Mostrar log + limpiar buffer       │
└──────────────────────────┴────────────────────────────────────┘
```

## Flujo

1. Usuario escribe `/diagnostico` o el agente detecta errores
2. Se ejecutan los health checks en paralelo (~2 seg)
3. Se muestra DiagnosticsCard con resultados
4. Usuario puede hacer clic en "Auto-corregir" por cada problema
5. Se re-ejecutan los checks para verificar corrección

