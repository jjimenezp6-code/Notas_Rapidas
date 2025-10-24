# Notas Rápidas (Nuxt 3 PWA · Clean Architecture)

## Requisitos
- Node.js 18+
- pnpm (`npm i -g pnpm`) o npm

## Desarrollo local
```bash
pnpm install
pnpm dev
```
Abre http://localhost:3000

## Build de producción
```bash
pnpm build
pnpm start
```
Sirve en http://localhost:3000

## Estructura (Clean Architecture)
- `src/domain`: Entidades e interfaces (Note, NoteRepository)
- `src/application`: Casos de uso (create/update/delete/list/get)
- `src/infrastructure`: Implementación (IndexedDB)
- `stores/`: Orquestación con Pinia (UI usa casos de uso)
- `pages/` y `components/`: Capa de presentación (Vue/Nuxt + Tailwind)

## PWA
- Manifest e iconos en `public/icons`
- Workbox cachea el shell y funciona offline
- Botón de instalación (component **InstallPWA**)
- Indicador online/offline en la barra superior

## Pruebas offline
1. Abre la app en el navegador.
2. Abre DevTools → Application → Service Workers y marca **Offline**.
3. Navega; verás que sigue funcionando.

## Despliegue (resumen)
- Build: `pnpm build`.
- Ejecutable: `.output/server/index.mjs`.
- Con Nginx como proxy inverso a `localhost:3000` y `systemd` para el proceso.
```

