import { string } from 'prop-types';

const selfRef = self as ServiceWorkerGlobalScope;

const map = new Map<string, Data>();

interface Data {
    filename: string;
    stream: ReadableStream;
}

selfRef.onmessage = ev => {
    const p = new Promise((resolve, reject) => {
        const port = ev.ports[0];
        const data = ev.data;

        const stream = createStream(port, resolve, reject);
        const filename = data.filename;

        const rands = new Uint8Array(16);
        crypto.getRandomValues(rands);
        const id = new TextDecoder('utf-8').decode(rands);
        const uniqueUrl = selfRef.registration.scope + 'download-uri' + id;

        map.set(uniqueUrl, { filename, stream });
        port.postMessage({
            uniqueUrl
        });
    });

    ev.waitUntil(p);
};

selfRef.onfetch = ev => {
    const url = ev.request.url;

    const data = map.get(url);
    if (!data) {
        return;
    }

    map.delete(url);

    ev.respondWith(
        Promise.resolve(
            new Response(data.stream, {
                headers: {
                    'Content-Type': 'application/octet-stream; charset=utf-8'
                }
            })
        )
    );
};

function createStream(
    port: MessagePort,
    resolve: any,
    reject: any
): ReadableStream {
    return new ReadableStream({
        start(controller) {
            port.onmessage = ({ data }) => {
                if (data === 'end') {
                    resolve();
                    controller.close();
                    return;
                }

                if (data === 'abort') {
                    resolve();
                    controller.error('Aborted the download');
                    return;
                }

                controller.enqueue(data);
            };
        },
        cancel() {
            resolve();
        }
    });
}
