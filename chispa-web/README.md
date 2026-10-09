# CHISPA — Página de presentación

Sitio con el informe del proyecto **CHISPA** (Biblioteca + Taller de Microelectrónica e
Informática — IPET N.º 66 "José Antonio Balseiro", 6.º A, 2026) y el modelo 3D interactivo
del recinto.

## Entregable principal

**`CHISPA.html`** (en la carpeta raíz) — un único archivo autocontenido:
modelo 3D embebido, sin internet, sin servidor. Doble clic y listo (Chrome/Edge/Firefox).

## Uso del visor 3D

- **Arrastrar** = girar · **clic derecho** = desplazarse · **rueda** = zoom
- Vistas rápidas: General, Taller (B), Biblioteca (A), Informática (C), Zona flexible
- **Corte**: vista tipo "casa de muñecas" (desactivado por defecto; al activarlo recorta por encima del 60% de la altura)
- **Girar**: rotación automática · **Etiquetas**: rótulos de zonas · **Pantalla completa**

## Regenerar el sitio

```bash
npm install
npm run build      # genera dist/index.html (copia ese archivo como CHISPA.html)
```

## Fuente del modelo

`src/model.glb` — convertido desde `BIBLIOTECA-TCI.skp` (SketchUp 2026) con
[OpenSKP](https://github.com/iamahsanmehmood/openskp) y optimizado con
`@gltf-transform/cli` (texturas WebP 1024px + meshopt, sin palette ni simplify para no romper colores/UVs: 6,06 MB → 579 KB).

> Nota: los materiales con alpha < 1 (vidrios) se fuerzan a `alphaMode: BLEND` en el GLB y
> a `transparent: true` en el visor, porque el export los escribe como opacos.

## Verificación

```bash
node verify.mjs    # abre la página, prueba visor, zonas y captura pantallazos
```
