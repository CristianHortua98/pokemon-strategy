# Pokémon Team Builder

Aplicación web desarrollada con **React, TypeScript, Vite y Tailwind CSS**, cuyo objetivo es facilitar la preparación estratégica de equipos Pokémon para combates.

La aplicación permite configurar dos equipos de seis Pokémon: un equipo propio y un equipo rival. A partir de la información del equipo contrario, el sistema analiza sus características y recomienda los movimientos y objetos más adecuados para cada uno de los Pokémon propios, buscando construir una estrategia de combate efectiva.

## Características principales

### 1. Configuración del equipo rival

Permite seleccionar los seis Pokémon del equipo contrario y configurar individualmente:

- **Pokémon:** selección de los integrantes del equipo.
- **Movimientos:** configuración de los cuatro movimientos de cada Pokémon.
- **Objeto:** selección del objeto equipado.
- **Habilidad:** configuración de la habilidad de cada Pokémon.

Esta información servirá como base para realizar el análisis estratégico del combate.

### 2. Configuración del equipo propio

Permite seleccionar los seis Pokémon que conformarán nuestro equipo de combate.

A diferencia del equipo rival, no será necesario configurar manualmente todos sus movimientos y objetos, ya que la aplicación se encargará de generar recomendaciones teniendo en cuenta la composición del equipo contrario.

### 3. Recomendaciones estratégicas

Una vez configurados ambos equipos, la aplicación analizará la información del equipo rival para sugerir:

- **Movimientos recomendados:** selección de movimientos adecuados para enfrentar a los Pokémon contrarios.
- **Objetos recomendados:** sugerencias de objetos que mejoren el rendimiento de cada Pokémon.
- **Estrategia de combate:** recomendaciones basadas en los tipos, habilidades, movimientos y características de los Pokémon rivales.

El objetivo es proporcionar una configuración optimizada del equipo propio para afrontar el enfrentamiento.

## Tecnologías utilizadas

- **React:** biblioteca para la construcción de interfaces de usuario.
- **TypeScript:** tipado estático para mejorar la calidad y mantenibilidad del código.
- **Vite:** herramienta de desarrollo y construcción del proyecto.
- **Tailwind CSS:** framework CSS para el diseño y estilización de la interfaz.

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al directorio del proyecto:

```bash
cd pokemon-team-builder
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución en desarrollo

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite proporcionará una URL local para acceder a la aplicación desde el navegador.

## Compilación para producción

Generar la versión optimizada del proyecto:

```bash
npm run build
```

Para visualizar localmente la versión compilada:

```bash
npm run preview
```

## Objetivo del proyecto

Desarrollar una herramienta que permita preparar equipos Pokémon de manera estratégica, reduciendo el trabajo manual de selección de movimientos y objetos.

La aplicación busca ayudar a los jugadores a tomar mejores decisiones antes de un combate, analizando la composición del equipo rival y proponiendo configuraciones adecuadas para enfrentarlo.

---

**Nota:** Este proyecto está orientado al análisis y planificación estratégica de equipos Pokémon. Las recomendaciones generadas dependerán de los datos disponibles y de las reglas de combate que implemente la aplicación.