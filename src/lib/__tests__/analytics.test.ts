import { describe, it, expect, vi } from "vitest";
vi.mock("../analytics.functions", () => ({ getGaId: async () => null }));
import { isSalesTel } from "../analytics";
describe("click to call is sales only", () => {
  it("counts sales numbers", () => { expect(isSalesTel("tel:844-236-2485")).toBe(true); expect(isSalesTel("tel:805-516-7409")).toBe(true); });
  it("ignores customer service numbers", () => { expect(isSalesTel("tel:805-477-2120")).toBe(false); expect(isSalesTel("tel:844-863-4407")).toBe(false); });
});
