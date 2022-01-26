import { handlers } from "./handlers";
import { setupWorker } from "msw";

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

// Expose method globally to make them available in integration tests
// @ts-ignore:next-line
window.msw = { worker };
