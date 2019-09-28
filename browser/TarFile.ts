import utf8 from 'utf8';
export class TarFile {
    constructor(private readonly writable: WritableStream<ArrayBuffer>) {}

    public writeFile(filename: string, data: ArrayBuffer) {
        const utf8Filename = this.toUtf8(filename);

        const length = utf8Filename.length;
        if (length >= 256) {
            throw new Error(
                `filename must be less than 256 utf8 characters, filename:${filename}`
            );
        }
        const padding = new Array<number>(255 - length).fill(0);
        utf8Filename.push(...padding);

        const prefix = utf8Filename.splice(0, 155);

        const header = new Uint8Array(512 + data.byteLength);
        header.set(utf8Filename);
        const mode = '0000777';
        header.set(this.toUtf8(mode), 100);

        const dataLength = data.byteLength.toString(8);
        header.set(this.toUtf8(dataLength), 124);

        const currentTime = new Date();
        const secondsSinceEpoch = Math.round(currentTime.getTime() / 1000);
        header.set(this.toUtf8(secondsSinceEpoch.toString(8)), 136);

        // TODO: checksum
        header.set(this.toUtf8('0'), 156);

        header.set(this.toUtf8('ustar'), 257);
        header.set(this.toUtf8('00'), 263);
        header.set(prefix, 345);

        const checksum =
            header.subarray(0, 512).reduce((total, current) => {
                return total + current;
            }) +
            32 * 8;
            
        header.set(this.toUtf8(checksum.toString(8)), 148);
        header.set(new Uint8Array(data), 512);
    }

    private toUtf8(str: string): number[] {
        return Array.from(utf8.encode(str)).map(char => char.charCodeAt(0));
    }
}
