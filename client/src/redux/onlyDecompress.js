import { createTransform } from "redux-persist";
import LZ from "lz-string";

const NODE_ENV =
  typeof process !== "undefined" ? process.env.NODE_ENV : "production";

export default function createTransformCompress(config) {
  return createTransform(
    state => state,
    state => {
      if (typeof state !== "string") {
        // state isn't transformed which means it isn't compressed anymore, just return it
        return state;
      }

      try {
        // state is a string, which means we have to decompress it
        return JSON.parse(LZ.decompressFromUTF16(state));
      } catch (err) {
        if (NODE_ENV !== "production") {
          console.error(
            "redux-persist-transform-compress: error while decompressing state",
            err
          );
        }
        return null;
      }
    },
    config
  );
}
