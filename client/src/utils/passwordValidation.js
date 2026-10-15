export function validatePassword(password) {
    const pw = typeof password === 'string' ? password : '';
  
    // 1. Evaluate individual rules for the live checklist
    const rules = {
      minLength: pw.length >= 8,
      hasUpper: /[A-Z]/.test(pw),
      hasLower: /[a-z]/.test(pw),
      hasNumber: /\d/.test(pw),
      hasSpecial: /[^A-Za-z0-9]/.test(pw),
    };
  
    const errors = [];
  
    if (!pw) {
      errors.push('Password is required.');
    } else {
      if (!rules.minLength) errors.push('Password must be at least 8 characters long.');
      if (!rules.hasUpper) errors.push('Password must contain at least one uppercase letter.');
      if (!rules.hasLower) errors.push('Password must contain at least one lowercase letter.');
      if (!rules.hasNumber) errors.push('Password must contain at least one number.');
      if (!rules.hasSpecial) errors.push('Password must contain at least one special character.');
    }
  
    return {
      valid: errors.length === 0,
      errors,
      rules,
    };
  }