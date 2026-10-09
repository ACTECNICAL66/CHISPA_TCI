# CHISPA — Biblioteca + Taller de Microelectrónica | IPET N.º 66

Proyecto Integrador · Proyecto escuela · 6.º A · 2026.
Transformación de la biblioteca (36 m², planta baja) en espacio híbrido:
**Biblioteca + Taller de Microelectrónica + Informática**, con zona central flexible.

🌐 **Página en vivo:** https://ACTECNICAL66.github.io/CHISPA_TCI/

## Contenido
- `chispa-web/` — fuente del sitio (Vite + three.js). `npm ci && npm run build` genera `dist/index.html`.
- `CHISPA.html` — entregable autocontenido (doble clic, sin internet).
- `chispa.glb` / `chispa-web/src/model.glb` — modelo 3D optimizado.
- `v_*.png` — capturas del visor.
- `informe.txt` + `Copia de Informe TU COLEGIO IDEAL (1).pdf` — informe del proyecto.

## Deploy
Cada push a `main` compila y publica automáticamente vía `.github/workflows/deploy.yml`
(GitHub Actions → Pages). Activar en el repo: **Settings → Pages → Source: GitHub Actions**.

Equipo: Alejandro Cantán, Elián Lencinas, Fabricio Pinto, Avril Zamboni, Paloma Murua,
Francisco Bustos · Docente asesor: Nicolás Agustín Dubois.
