import { put, del } from '@vercel/blob';

const BLOB_TOKEN = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
    console.warn('⚠️ VITE_BLOB_READ_WRITE_TOKEN no está configurado. Las subidas de imágenes fallarán.');
}

/**
 * Sube un archivo a Vercel Blob Storage
 * @param file - Archivo a subir
 * @param folder - Carpeta donde guardar (ej: 'products', 'gallery', 'events')
 * @returns URL pública del archivo subido
 */
export async function uploadToBlob(file: File, folder: string = 'uploads'): Promise<string> {
    if (!BLOB_TOKEN) {
        throw new Error('Token de Vercel Blob no configurado');
    }

    try {
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log(`📤 Subiendo archivo a Vercel Blob: ${fileName}`);

        const blob = await put(fileName, file, {
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
 * Sube múltiples archivos a Vercel Blob Storage
 * @param files - Array de archivos a subir
 * @param folder - Carpeta donde guardar
 * @returns Array de URLs públicas
 */
export async function uploadMultipleToBlob(files: File[], folder: string = 'uploads'): Promise<string[]> {
    const uploadPromises = files.map(file => uploadToBlob(file, folder));
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
