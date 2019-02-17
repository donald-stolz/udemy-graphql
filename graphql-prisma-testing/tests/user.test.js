import { getFirstName } from "../src/utils/user";

test("Should return first name", () => {
  const firstName = getFirstName("Donald Stolz");

  expect(firstName).toBe("Donald");
});
