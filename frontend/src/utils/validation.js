export function sanitizeLeadingWhitespace(value) {
  if (typeof value !== "string") {
    return value;
  }
  return value.replace(/^[^A-Za-z0-9]+/, "");
}

export function runRules(value, rules = []) {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return typeof result === "string" ? result : "Invalid value.";
    }
  }
  return "";
}

export const validators = {
  required: (fieldLabel = "This field") => (value) => {
    const normalized = typeof value === "string" ? value.trim() : value;
    return normalized ? true : `${fieldLabel} is required.`;
  },

  email: (message = "Enter a valid email address.") => (value) => {
    const normalized = typeof value === "string" ? value.trim() : "";
    if (!normalized) return true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(normalized) ? true : message;
  },

  allowedEmailDomains: (domains = [], message) => (value) => {
    const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (!normalized) return true;

    const atIndex = normalized.lastIndexOf("@");
    if (atIndex === -1) return true;

    const domain = normalized.slice(atIndex + 1);
    const allowed = domains.map((d) => String(d).toLowerCase());

    return allowed.includes(domain)
      ? true
      : (message || `Email domain must be one of: ${allowed.join(", ")}.`);
  },

  minLength: (length, message) => (value) => {
    if (value == null || value === "") return true;
    return String(value).length >= length
      ? true
      : (message || `Must be at least ${length} characters.`);
  },

  maxLength: (length, message) => (value) => {
    if (value == null || value === "") return true;
    return String(value).length <= length
      ? true
      : (message || `Must be at most ${length} characters.`);
  },

  noLeadingWhitespace: (fieldLabel = "This field") => (value) => {
    if (typeof value !== "string" || !value) return true;
    return /^[^A-Za-z0-9]/.test(value)
      ? `${fieldLabel} first character must be a letter or number.`
      : true;
  },

  passwordStrength: ({ minLength = 6 } = {}) => (value) => {
    const normalized = typeof value === "string" ? value : "";
    if (!normalized) return true;

    if (normalized.length < minLength) {
      return `Password must be at least ${minLength} characters.`;
    }

    if (!/[A-Z]/.test(normalized)) {
      return "Password must include at least 1 uppercase letter.";
    }

    if (!/[0-9]/.test(normalized)) {
      return "Password must include at least 1 number.";
    }

    return true;
  },
};
