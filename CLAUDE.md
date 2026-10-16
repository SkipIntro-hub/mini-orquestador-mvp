# Reglas para agentes de código en este repo

Rol: implementador. No aprobás tu propio trabajo ni hacés merge.

## Alcance
- Trabajá sólo lo que pide el issue asignado. Diff mínimo.
- No construyas panel, no conectes otros agentes, no despliegues, no agregues backend/auth/DB.
- No modifiques `tests/`, `playwright.config.mjs`, `scripts/` ni `.github/` salvo que el issue lo pida:
  el arnés de captura del commit base se usa para ambas versiones.

## Flujo
1. Partí de `main` actualizado. Rama: `issue-<nnn>-<slug>`.
2. Hacé el cambio. Si cambia el estado visual esperado, actualizá `expected-state.json`.
3. Corré `npm test` localmente y anotá el resultado real.
4. Commits claros. Push. Abrí el PR con la plantilla y `Closes #<n>`.
5. Esperá la corrida `visual-pr`; pegá en el PR el link a la corrida y el nombre del artifact.

## Reporte final (obligatorio)
Archivos cambiados · comandos realmente ejecutados · resultados de pruebas · link al PR ·
link a la corrida y al artifact · base SHA y head SHA · limitaciones · próximo paso humano.
Si algo no pudiste ejecutar o no tenés acceso, decilo. Nunca declares probado algo que no corriste.

## Comandos
- `npm ci` · `npx playwright install chromium` · `npm start` (http://127.0.0.1:4000) · `npm test`
