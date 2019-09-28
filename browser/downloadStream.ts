export function downloadStream(filename: string): WritableStream<ArrayBuffer> {
    const channel = new MessageChannel();
    navigator.serviceWorker
        .register('sw.bundle.js', {
            scope: './'
        })
        .then(registration => {
            const regWaiting = registration.installing || registration.waiting;
            if (registration.active) {
                registration.active.postMessage({ filename }, [channel.port2]);
            }
            
            if (regWaiting) {
                regWaiting.onstatechange = ev => {
                    if (regWaiting.state === 'activated') {
                        registration.active!.postMessage({ filename }, [
                            channel.port2
                        ]);
                    }
                };
            }
        });
    return new WritableStream<ArrayBuffer>({
        start() {
            return new Promise(resolve => {
                channel.port1.onmessage = ev => {
                    resolve();
                    const url: string = ev.data.uniqueUrl;
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;

                    const click = new MouseEvent('click');
                    link.dispatchEvent(click);
                };
            });
        },
        write(data) {
            channel.port1.postMessage(data, [data]);
        },
        close() {
            channel.port1.postMessage('end');
        },
        abort() {
            channel.port1.postMessage('abort');
        }
    });
}
