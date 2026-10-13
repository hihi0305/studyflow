const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validatePassword,
} = require("../src/utils/passwordValidation");

test("accepts a password that meets all requirements", () => {
  const result = validatePassword("Study123!");

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("rejects a password shorter than 8 characters", () => {
  const result = validatePassword("Ab1!");

  assert.equal(result.valid, false);
  assert.ok(
    result.errors.includes("Password must be at least 8 characters long.")
  );
});

test("rejects a password without an uppercase letter", () => {
  const result = validatePassword("study123!");

  assert.equal(result.valid, false);
  assert.ok(
    result.errors.includes(
      "Password must contain at least one uppercase letter."
    )
  );
});

test("rejects a password without a lowercase letter", () => {
  const result = validatePassword("STUDY123!");

  assert.equal(result.valid, false);
  assert.ok(
    result.errors.includes(
      "Password must contain at least one lowercase letter."
    )
  );
});

test("rejects a password without a number", () => {
  const result = validatePassword("StudyFlow!");

  assert.equal(result.valid, false);
  assert.ok(
    result.errors.includes("Password must contain at least one number.")
  );
});

test("rejects a password without a special character", () => {
  const result = validatePassword("Study123");

  assert.equal(result.valid, false);
  assert.ok(
    result.errors.includes(
      "Password must contain at least one special character."
    )
  );
});

test("reports multiple password validation failures", () => {
  const result = validatePassword("password");

  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 1);
});

test("rejects a missing password value", () => {
  const result = validatePassword(null);

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ["Password is required."]);
});
