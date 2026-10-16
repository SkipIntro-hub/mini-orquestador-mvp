Título: Issue 001 — Cambiar el botón "Probar" de azul a verde

## Objetivo
Validar que un cambio pequeño recorra el circuito issue → rama → PR → evidencia visual → aprobación humana.

## Instrucción para el agente
Partí del commit base de `main`. Creá la rama `issue-001-boton-verde` y cambiá únicamente el color de fondo
del botón "Probar", de `#2563EB` a `#16A34A` (en `app/styles.css`). Conservá texto, tamaño, posición y
comportamiento. Actualizá `backgroundColor` en `expected-state.json` a `#16A34A`.
No toques `tests/`, `scripts/`, `playwright.config.mjs` ni `.github/`.

Abrí un PR vinculado con este issue (`Closes #<este número>`) usando la plantilla. Explicá el cambio,
las verificaciones realizadas y cualquier limitación. Incluí el enlace a la corrida de Actions y al
artifact `visual-pr-<n>-<sha>` cuando esté disponible. **No hagas merge.**

## Entregables
- Rama con el cambio y commits claros.
- PR vinculado a este issue.
- Artifact con `before.png` (commit base) y `after.png` (HEAD de la rama), `playwright-report/` completo y `metadata.json` con ambos SHA y condiciones.

## Criterios de aceptación
- [ ] La base muestra el botón azul `#2563EB`.
- [ ] El commit del PR muestra el mismo botón verde `#16A34A`.
- [ ] Texto, tamaño, posición y comportamiento se mantienen (lo verifica el proyecto `after` contra `before`).
- [ ] El diff contiene sólo `app/styles.css` y `expected-state.json`.
- [ ] La prueba valida botón visible y color calculado: azul en base, verde en PR.
- [ ] La última corrida de `visual-pr` del commit a revisar termina en verde.
- [ ] El artifact contiene before.png, after.png, reporte HTML completo y metadata.json.
- [ ] Los SHA de metadata.json coinciden con base y head del PR.
- [ ] La evidencia se descarga y el reporte abre siguiendo el README.
- [ ] Una persona revisa código, resultados y capturas antes del merge.

Un cambio visual correcto con pruebas fallidas o evidencia faltante no cumple el issue.
