import { put, del } from '@vercel/blob';

const BLOB_TOKEN = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
    console.warn('⚠️ VITE_BLOB_READ_WRITE_TOKEN no está configurado. Las subidas de imágenes fallarán.');
}

/**
 * Convierte una imagen a formato WebP usando Canvas
 * @param file - Archivo de imagen original
 * @param quality - Calidad de compresión (0-1), default: 0.85
 * @param maxWidth - Ancho máximo de la imagen, default: 1920
 * @param maxHeight - Alto máximo de la imagen, default: 1920
 * @returns Promise con el Blob en formato WebP
 */
async function convertToWebP(
    file: File,
    quality: number = 0.85,
    maxWidth: number = 1920,
    maxHeight: number = 1920
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        // Si no es una imagen, devolver el archivo original
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        // Si ya es WebP, verificar si necesita redimensionarse
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // Calcular dimensiones manteniendo proporción
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            // Crear canvas para la conversión
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('No se pudo crear el contexto del canvas'));
                return;
            }

            // Dibujar imagen en el canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir a WebP
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        console.log(`🖼️ Imagen convertida: ${file.name} (${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB, ${((1 - blob.size / file.size) * 100).toFixed(1)}% reducción)`);
                        resolve(blob);
                    } else {
                        reject(new Error('Error al convertir a WebP'));
                    }
                },
                'image/webp',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Error al cargar la imagen'));
        };

        img.src = url;
    });
}

/**
 * Sube un archivo a Vercel Blob Storage (convierte imágenes a WebP automáticamente)
 * @param file - Archivo a subir
 * @param folder - Carpeta donde guardar (ej: 'products', 'gallery', 'events')
 * @param options - Opciones de conversión: quality (0-1), maxWidth, maxHeight
 * @returns URL pública del archivo subido
 */
export async function uploadToBlob(
    file: File,
    folder: string = 'uploads',
    options: { quality?: number; maxWidth?: number; maxHeight?: number } = {}
): Promise<string> {
    if (!BLOB_TOKEN) {
        throw new Error('Token de Vercel Blob no configurado');
    }

    try {
        const { quality = 0.85, maxWidth = 1920, maxHeight = 1920 } = options;
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);

        let fileToUpload: Blob = file;
        let fileName: string;

        // Si es una imagen, convertir a WebP
        if (file.type.startsWith('image/')) {
            console.log(`🔄 Convirtiendo imagen a WebP: ${file.name}`);
            fileToUpload = await convertToWebP(file, quality, maxWidth, maxHeight);
            fileName = `${folder}/${timestamp}-${randomId}.webp`;
        } else {
            const fileExt = file.name.split('.').pop();
            fileName = `${folder}/${timestamp}-${randomId}.${fileExt}`;
        }

        console.log(`📤 Subiendo archivo a Vercel Blob: ${fileName}`);

        const blob = await put(fileName, fileToUpload, {
            access: 'public',
            token: BLOB_TOKEN,
        });

        console.log(`✅ Archivo subido exitosamente: ${blob.url}`);
        return blob.url;
    } catch (error) {
        console.error('❌ Error subiendo archivo a Vercel Blob:', error);
        throw new Error(`Error al subir archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
}

/**
 * Sube múltiples archivos a Vercel Blob Storage (convierte imágenes a WebP)
 * @param files - Array de archivos a subir
 * @param folder - Carpeta donde guardar
 * @param options - Opciones de conversión
 * @returns Array de URLs públicas
 */
export async function uploadMultipleToBlob(
    files: File[],
    folder: string = 'uploads',
    options: { quality?: number; maxWidth?: number; maxHeight?: number } = {}
): Promise<string[]> {
    const uploadPromises = files.map(file => uploadToBlob(file, folder, options));
    return Promise.all(uploadPromises);
}

/**
 * Elimina un archivo de Vercel Blob Storage
 * NOTA: Las eliminaciones directas desde el navegador están bloqueadas por CORS y por seguridad de Vercel.
 * Se requiere un entorno de servidor (Node.js/Edge Functions) para que funcione.
 * @param url - URL del archivo a eliminar
 */
export async function deleteFromBlob(url: string): Promise<void> {
    if (!BLOB_TOKEN) {
        throw new Error('Token de Vercel Blob no configurado');
    }

    try {
        // Solo intentar borrar si es una URL de Vercel Blob
        if (!url.includes('vercel-storage.com') && !url.includes('blob.vercel-storage.com')) {
            console.log(`⏭️ Omitiendo borrado, no es una URL de Vercel Blob: ${url}`);
            return;
        }

        // DETECCIÓN DE ENTORNO NAVEGADOR (CORS preventer)
        if (typeof window !== 'undefined') {
            console.warn('⚠️ Vercel Blob: Las eliminaciones no son posibles directamente desde el navegador debido a restricciones de CORS y seguridad.');
            console.log('💡 El archivo permanecerá en Vercel Blob pero el registro ha sido eliminado de la base de datos.');
            return;
        }

        console.log(`🗑️ Eliminando archivo de Vercel Blob: ${url}`);
        await del(url, { token: BLOB_TOKEN });
        console.log(`✅ Archivo eliminado exitosamente`);
    } catch (error) {
        console.error('❌ Error eliminando archivo de Vercel Blob:', error);
        // No lanzamos error aquí para no bloquear otras operaciones
        console.warn('⚠️ Continuando a pesar del error de eliminación');
    }
}

/**
 * Elimina múltiples archivos de Vercel Blob Storage
 * @param urls - Array de URLs a eliminar
 */
export async function deleteMultipleFromBlob(urls: string[]): Promise<void> {
    const deletePromises = urls.map(url => deleteFromBlob(url));
    await Promise.allSettled(deletePromises); // Usamos allSettled para no fallar si uno falla
}

/**
 * Verifica si una URL es de Vercel Blob
 * @param url - URL a verificar
 * @returns true si es una URL de Vercel Blob
 */
export function isBlobUrl(url: string): boolean {
    return url.includes('vercel-storage.com') || url.includes('blob.vercel-storage.com');
}
