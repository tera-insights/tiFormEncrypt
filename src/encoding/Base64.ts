import { binaryToString } from "./misc";

export class Base64
{
    static encode(data: Uint8Array, urlSafe = false): string
    {
        const base64 = btoa(binaryToString(data));
        return urlSafe ? Base64.makeURLSafe(base64) : base64;
    }

    static makeURLSafe(base64: string): string
    {
        return base64
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    static makeStandard(urlSafe: string): string
    {
        let standard = urlSafe
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        switch (standard.length % 4)
        {
            case 2: standard += "="; // fallthrough (double padding)
            case 3: standard += "=";
        }

        return standard;
    }

    static decode(base64: string): Uint8Array
    {
        // Make sure it's standard Base64 w/ padding
        base64 = Base64.makeStandard(base64);
    
        const dataStr = atob(base64);
        const data = new Uint8Array(dataStr.length);
    
        for (let i = 0; i < data.length; i++)
            data[i] = dataStr.charCodeAt(i);
    
        return data;
    }
}