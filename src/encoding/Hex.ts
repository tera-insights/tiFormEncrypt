
const byteToHex = new Array<string>(0xff);
const hexToByte: {[hex: string]: number} = {};

for (let i = 0; i <= 0xff; ++i)
{
    const hex = ("0" + i.toString(16)).slice(-2);
    byteToHex[i] = hex;
    hexToByte[hex] = i;
}

export class Hex
{
    static encode(data: Uint8Array): string
    {
        let hex = "";

        for (let i = 0; i < data.length; ++i)
            hex += byteToHex[data[i]];

        return hex;
    }

    static decode(hex: string): Uint8Array
    {
        if (hex.length % 2 !== 0)
            throw new Error("odd hex length");

        const data = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length; i += 2)
            data[i / 2] = hexToByte[hex.substring(i, i + 2)];

        return data;
    }
}