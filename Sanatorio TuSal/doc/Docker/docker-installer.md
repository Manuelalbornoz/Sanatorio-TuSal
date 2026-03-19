# Guía para ejecutar un archivo `docker-compose.yml`

## Índice

1. [Introducción](#1-introducción)
2. [Requisitos previos](#2-requisitos-previos)
   - [Docker Desktop](#docker-desktop)
     - [Instalación de Docker Desktop](#instalación-de-docker-desktop)
     - [¿Para qué sirve Docker Desktop?](#para-qué-sirve-docker-desktop)
3. [Archivos Dockerfile](#3-archivos-dockerfile)
   - [Explicación general de las etapas](#Explicación-general-de-las-etapas)
4. [Archivo docker-compose.yml](#4-archivo-docker-composeyml)
5. [Pasos para ejecutar el archivo `docker-compose.yml`](#5-pasos-para-ejecutar-el-archivo-docker-composeyml)
   - [Paso 1: Ejecutar Docker Desktop](#paso-1-ejecutar-docker-desktop)
   - [Paso 2: Configuración del Acceso a la Base de Datos](#paso-2-configuracion-del-acceso-a-la-base-de-datos)
   - [Paso 3: Configuración del archivo `docker-compose.yml`](#paso-3-configuracion-del-archivo-docker-composeyml)
   - [Paso 4: Construir y ejecutar los contenedores](#paso-4-construir-y-ejecutar-los-contenedores)
6. [Gestión de Imágenes y Contenedores en Docker Desktop](#6-gestión-de-imágenes-y-contenedores-en-docker-desktop)

## 1. Introducción

Esta guía proporciona instrucciones detalladas sobre cómo ejecutar un archivo `docker-compose.yml` que incorpora la configuración de múltiples microservicios desarrollados en .NET Core. A lo largo del documento, se abordan los siguientes conceptos y herramientas esenciales:

- Docker Desktop
- Archivos `Dockerfile`
- Archivo `docker-compose.yml`
- Archivo `dockerignore`
- Pasos para ejecutar `docker-compose.yml`

## 2. Requisitos previos

### Docker Desktop

**Docker Desktop** es una aplicación para MacOS y Windows que permite la creación y compartición de aplicaciones mediante contenedores Docker. Integra Docker Engine y Docker CLI, así como Docker Compose y otras herramientas relevantes.

#### Instalación de Docker Desktop

1. **Descargar Docker Desktop**: Accede a la [página de descargas de Docker](https://www.docker.com/products/docker-desktop) y elige la versión apropiada para tu sistema operativo.
2. **Instalar Docker Desktop** Sigue las instrucciones proporcionadas por el instalador. En el caso de Windows, asegúrate de activar la integración con WSL 2 durante el proceso de instalación.
   **Iniciar Docker Desktop**: Una vez completada la instalación, inicia Docker Desktop. Para verificar que Docker se está ejecutando correctamente, abre una terminal y ejecuta el comando
   `docker --version`.

### ¿Para qué sirve Docker Desktop?

Docker Desktop facilita el desarrollo de aplicaciones en contenedores, permitiendo que los desarrolladores construyan, ejecuten y gestionen contenedores directamente desde su máquina local. Proporciona un entorno estandarizado que asegura que las aplicaciones funcionen de manera consistente en diferentes entornos (desarrollo, prueba, producción).

## 3. Archivos Dockerfile

Un `Dockerfile` es un archivo de texto que contiene todas las instrucciones necesarias para construir una imagen Docker. A continuación, se muestra un ejemplo de la configuración del archivo Dockerfile para el microservicio de Gestión de Eventos. La configuración de los demás archivos Dockerfile será similar:

```Dockerfile

# La "base" del contenedor — usa Node.js versión 20 , "alpine" es una versión liviana de Linux (menos peso)
FROM node:20-alpine

# Crea la carpeta /app dentro del contenedor y todas las instrucciones siguientes se ejecutan desde ahí
WORKDIR /app

# Copia el package.json y package-lock.json ANTES que el resto
# del código — esto es una optimización para que Docker no reinstale dependencias si el código no cambió
COPY package*.json ./

# Instala todas las dependencias del proyecto (lee el package.json que acabamos de copiar)
RUN npm install

# Ahora sí copia TODO el resto del proyecto al contenedor (src/, tsconfig.json, etc.)
COPY . .

# Compila el TypeScript a JavaScript genera la carpeta /app/dist dentro del contenedor
RUN npm run build

# Documenta que el contenedor usa el puerto 3000 (no abre el puerto, solo lo declara)
EXPOSE 3000

# Comando que se ejecuta cuando arranca el contenedor corre el archivo compilado dist/main.js
CMD ["node", "dist/main"]


### Explicación general de las etapas:

-Etapa base:
    *Se utiliza una imagen base de Node.js 20 con su variante alpine (version liviana de linux). Se establece el directorio
    de trabajo /app donde se alojara toda la aplicacion dentro del contenedor y se expone el puerto 3000 para recibir las
    las solicitudes HTTP

-Etapa de instalacion de dependencias(Build):
    *Se copian los archivos definidos de dependencias al contenedor y luego se ejecuta "npm install" para restaurarlas.
    En esta etapa se realiza de forma separada del codigo fuente para aprovechar el sistema de cache de Docker, evitando
    reinstalar dependecias cuando solo cambia el codigo de aplicacion.
    
-Etapa de construccion:
    *Se copia el codigo fuente completo del proyecto al contenedor y se compila el TypeScript a JavaScript mediante 
    "npm run build", generando los archivos optimizados en el directorio, listos para ejecutarse en produccion.

-Etapa de ejecucion:
    *Se configura el "docker-compose.yml", esta complementa el "Dockerfile", orquestando los servicios necesarios,
    definiendo las variables de entorno de conexion a bases de datos, la politica de reinicio automatico ante fallos y
    el mapeo de puertos entre el contenedor y la maquina host.

## 4. Archivo docker-compose.yml

El archivo docker-compose.yml define los servicios que conforman la aplicación, así como las redes y volúmenes necesarios para su ejecución. Por otro lado, el archivo `docker-compose.override.yml` se utiliza para proporcionar configuraciones adicionales o sobrescribir las configuraciones existentes en el archivo principal `docker-compose.yml`. Es común su uso para configurar variables de entorno, puertos expuestos y volúmenes de montaje en entornos específicos, como el de desarrollo.

### Explicación de docker-compose.yml

El contenido del archivo `docker-compose.yml` es el siguiente:
´´´
version: '3.8'

services:
  backend:
    build: .
    container_name: sanatorio_backend
    restart: on-failure
    ports:
      - "3000:3000"
    environment:
      MYSQL_HOST: db
      MYSQL_PORT: 3306
      MYSQL_USER: admin
      MYSQL_PASSWORD: root
      MYSQL_DB: SanatorioTuSal
    depends_on:
      - db

volumes:
  db_data:

´´´
El mapeo de puertos es una configuracion esencial en Docker la cual permite que los servicios dentro de los contenedores 
sean accesibles desde el host (la maquina local). A continuacion se explica como se realiza este mapeo y como se puede acceder a cada servicio desde el host:

    sanatorio_backend:
        *Dockerfile: Ubicado en la raíz del proyecto.
        
        *Puerto: Mapeado desde el puerto 3000 dentro del contenedor al puerto 3000 en el host.
        
        *Acceso: Se puede acceder a este servicio desde el host mediante http://localhost:3000.
        
        *Política de reinicio: Configurado con restart: on-failure, lo que significa que Docker reiniciará automáticamente el   contenedor en caso de fallo, garantizando la disponibilidad del servicio.
        
        *Variables de entorno: Se proveen las credenciales y configuración de conexión a la base de datos MySQL directamente desde el archivo docker-compose.yml, evitando exponer información sensible dentro de la imagen.
        
        *Dependencia: El servicio depende del servicio db, por lo que Docker Compose garantiza que la base de datos se inicie antes que el backend.

### Explicación de dockerignore
    El archivo .dockerignore solamente indica que archivos y carpetas debes excluirse al momento de copiar el proyecto al contenedor
    durante la ejecucion, reduciendo el tamaño de la imagen y evitando incluir informacion sensible o innecesario.

 node_modules

    Descripción: Carpeta que contiene todas las dependencias instaladas localmente mediante npm install.
    Motivo de exclusión: Las dependencias se reinstalan dentro del contenedor durante la construcción de la imagen, por lo que copiarlas desde el host sería redundante y agregaría miles de archivos innecesarios, incrementando considerablemente el tamaño de la imagen.

 dist

    Descripción: Carpeta que contiene el código TypeScript compilado a JavaScript, generada localmente mediante npm run build.
    Motivo de exclusión: El contenedor genera su propia versión compilada durante la etapa de construcción, por lo que la carpeta local no debe incluirse para evitar conflictos entre versiones.

 .env

    Descripción: Archivo que contiene las variables de entorno con información sensible como credenciales de base de datos y configuraciones del sistema.
    Motivo de exclusión: Se excluye por razones de seguridad. Las variables de configuración se proveen directamente desde el archivo docker-compose.yml, evitando que datos sensibles queden expuestos dentro de la imagen de Docker.

 .log

    Descripción: Archivos de registro generados durante la ejecución local de la aplicación en modo desarrollo.
    Motivo de exclusión: Los archivos de log son propios del entorno local de desarrollo y no son necesarios para construir ni ejecutar la aplicación dentro del contenedor.


## 5. Pasos para ejecutar el archivo `docker-compose.yml`

- **Paso 1**: Ejecutar Docker Desktop

- **Paso 2**: Configuración del acceso a la base de datos
    
    El sistema utiliza una instancia de MySQL instalada localmente en la máquina host. Las credenciales de conexión se configuran directamente en el archivo docker-compose.yml mediante variables de entorno en la sección environment del servicio backend:


Verificar que el servidor MySQL local se encuentre en ejecución y que el usuario admin tenga permisos sobre la base de datos SanatorioTuSal antes de levantar los contenedores.


- **Paso 3**: Configuración del archivo `docker-compose.yml`

  Verificar que el puerto 3000 no esté bloqueado ni en uso por otras aplicaciones, ya que esto podría causar errores al levantar el servicio backend.

- **Paso 4**: Construir y ejecutar los contenedores

  **Abrir una terminal**: Navega al directorio donde se encuentra tu archivo docker-compose.yml. Por ejemplo:

  ```bash
  C:\Sanatorio-TuSal\Sanatorio TuSal\src
  ```

  **Construir y ejecutar los servicios**: Ejecuta el siguiente comando para construir y levantar todos los servicios definidos en el archivo docker-compose.yml

  ```bash
  docker-compose up -d
  ```

  Este comando construirá las imágenes Docker para cada servicio (si no están ya construidas) y luego levantará los contenedores.La bandera `-d` hace que los contenedores se ejecuten en segundo plano, lo que significa que liberan la terminal una vez que se inician, permitiendo al usuario continuar con otras tareas mientras los contenedores siguen ejecutándose en segundo plano. Esto es útil en entornos de producción o cuando se ejecutan múltiples contenedores simultáneamente y se desea mantener la terminal libre para otras operaciones.

   Ejemplo de una parte de la salida de la ejecución del comando:
    ![ejecutar_comando](./imagenes/ejecutar_comando.png)
  
    Resultado existoso de la creación de los distintos servicios:
    ![ejecutar_comando_resultado](./imagenes/ejecutar_comando_resultado.png)
  
    **Docker Desktop**:
  
    Imágenes
    ![docker_desktop_imagenes](./imagenes/docker_desktop_imagenes.png)
  
    Contenedores
    ![docker_desktop_imagenes](./imagenes/docker_desktop_contenedores.png)
  
  ## 6. Gestión de Imágenes y Contenedores en Docker Desktop
  
  **Docker Desktop** simplifica la gestión de imágenes y contenedores mediante una interfaz gráfica intuitiva. A continuación, se detalla cómo administrar un contenedor y actualizar su imagen, especialmente cuando se requiere instalar una nueva versión de una imagen específica sin afectar a los demás servicios.
  
  ### Actualización de Imágenes y Contenedores
  
  1. Detención y Eliminación del Contenedor Existente:
  
     - Abrir Docker Desktop.
     - Navegar a la pestaña Containers y ubicar el contenedor del servicio que deseas actualizar.
     - Detener el contenedor haciendo clic en el botón de detención (stop).
     - Eliminar el contenedor haciendo clic en el botón de eliminación.
  
     ![docker_desktop_eliminar_contenedor](./imagenes/docker_desktop_eliminar_contenedor.png)
  
  2. Eliminación de la Imagen Antigua:
  
     - Navegar a la pestaña Images en Docker Desktop.
     - Buscar la imagen antigua del servicio que se desea actualizar.
     - Eliminar la imagen haciendo clic en el botón de eliminación (icono de papelera).
  
     ![docker_desktop_eliminar_imagen](./imagenes/docker_desktop_eliminar_imagen.png)
  
  3. Construcción y Ejecución del Contenedor con la Nueva Imagen:
  
  - Para generar la nueva imagen actualizada applicar el mismo procedimiento descito en la sección [Pasos para ejecutar el archivo `docker-compose.yml`](#5-pasos-para-ejecutar-el-archivo-docker-composeyml)

