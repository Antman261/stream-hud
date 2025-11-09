import z from 'zod';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const textBinaryCodec = z.codec(z.instanceof(Uint8Array), z.string(), {
  decode: (bytes) => textDecoder.decode(bytes),
  encode: (text) => textEncoder.encode(text),
});
