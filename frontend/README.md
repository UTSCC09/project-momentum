# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Deployment

```
cd frontend
docker build -t frontend -f Dockerfile .
docker run -d --rm -p 80:4173 frontend
```

Frontend is now accessible at http://34.130.127.231/.

**TODO:** Fix build error. Currently, `npm run build` only does `vite build` instead of `vue-tsc -b && vite build`. Need to fix build error and enable `vue-tsc -b`.
