/**
 * @jest-environment node
 */

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  it("returns a no-store ok response", async () => {
    const response = GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(payload).toMatchObject({
      status: "ok",
      service: "tdscompany-weather-app",
    });
    expect(new Date(payload.timestamp).toString()).not.toBe("Invalid Date");
  });
});
