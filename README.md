# mini-orquestador-mvp

MVP del circuito: **issue → Claude Code → rama → PR → pruebas + evidencia visual → revisión humana → merge**.
App estática de una página con un botón "Probar". Sin backend, auth ni DB.

## Requisitos
- Node 22 (`.nvmrc`)
- Dependencias fijadas en `package-lock.json` (`@playwright/test` 1.63.0)

## Uso local
```bash
npm ci
npx playwright install chromium     # Linux: agregar --with-deps
npm start                           # http://127.0.0.1:4000
npm test                            # verifica el botón contra expected-state.json
npm run report                      # abre evidence/playwright-report
```
La captura local queda en `evidence/local.png`.

## Cómo se genera la evidencia en un PR (`.github/workflows/visual-pr.yml`)
1. Toma `base.sha` y `head.sha` del evento del PR y los registra.
2. Hace checkout de cada uno en carpetas aisladas (`base/`, `head/`). El head es el commit real de la rama,
   no el merge sintético que usa el checkout por defecto. Verifica ambos con `git rev-parse`.
3. Instala el arnés **del commit base** y lo usa para las dos capturas (mismo procedimiento).
4. Levanta dos servidores en procesos separados: base en `:4001`, head en `:4002`. Cada uno expone
   `/__build` con su SHA y la prueba verifica que coincida antes de capturar.
5. Proyecto `before`: verifica color de `base/expected-state.json` y captura. Proyecto `after`: verifica color
   de `head/expected-state.json`, captura y exige mismo texto, tamaño, posición, tipografía y comportamiento que `before`.
6. Escribe `metadata.json` y publica el artifact aunque falle (el job conserva el fallo).

Condiciones: Chromium, 1280×720, escala 1, esquema claro, locale es-AR, reduced motion, animaciones
desactivadas, sin hover/foco, sin fuentes ni red externas.

## Descargar y abrir la evidencia
1. PR → pestaña **Checks** → `visual-pr` → **Summary** → sección **Artifacts** → `visual-pr-<n>-<sha>`.
2. Descomprimir. Contiene `before.png`, `after.png`, `metadata.json`, `*-state.json`, `playwright-report/`.
3. Abrir el reporte: `npx playwright show-report ruta/al/playwright-report`
   (abrir `index.html` con doble clic puede no cargar los adjuntos por restricciones del navegador).
4. Confirmar en `metadata.json` que `baseSha` y `headSha` coinciden con los del PR.

Si el PR recibe commits nuevos, la evidencia anterior queda desactualizada: revisar la corrida del último commit.

## Reglas para agentes
Ver `CLAUDE.md`. Texto del primer issue: `ISSUE_001.md`.
