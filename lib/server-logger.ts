type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function writeLog(level: LogLevel, message: string) {
  if (level === "error") {
    console.error(message);
    return;
  }

  if (level === "warn") {
    console.warn(message);
    return;
  }

  console.info(message);
}

export function logServerEvent(level: LogLevel, event: string, payload: LogPayload = {}) {
  writeLog(
    level,
    JSON.stringify({
      level,
      event,
      timestamp: new Date().toISOString(),
      ...payload,
    }),
  );
}

export function getErrorDetails(error: unknown): LogPayload {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }

  return {
    errorName: "UnknownError",
    errorMessage: String(error),
  };
}
