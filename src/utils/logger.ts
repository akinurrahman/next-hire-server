import pino from "pino";
import pretty from "pino-pretty";
import { formatISO } from "date-fns";

// Create a pretty-print stream for development
const stream = pretty({
  colorize: true, // colorful output
  translateTime: true, // auto-format timestamp nicely
});

// Create logger instance
const log = pino(
  {
    base: { pid: false }, 
    timestamp: () => `,"time":"${formatISO(new Date())}"`,
  },
  stream // send logs through pretty-print stream
);

export default log;
