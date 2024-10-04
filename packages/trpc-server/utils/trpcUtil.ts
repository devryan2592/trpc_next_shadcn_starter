// @ts-nocheck

import { uneval } from "devalue";
import superjson from "superjson";

export const transformer = {
  input: superjson,
  output: {
    serialize: (object) => uneval(object),
    deserialize: (object) => eval(`${object}`),
  },
};
