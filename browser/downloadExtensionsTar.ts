export async function downloadExtensionsTar(exts: string[]) : Promise<ReadableStream> {
    return new ReadableStream()
    for (const ext of exts) {
        const response = await fetch(ext);
        const contentLength = response.headers.get('content-length');
        if (contentLength) {

        }
    }

    return undefined as any as ReadableStream;
}
