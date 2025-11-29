const frontendErrorMessage = {
  // Login / auth
  1000: 'Usuario y/o contraseña no son correctos',
  1001: 'Hay información inválida en el formulario. Revisa los campos e inténtalo nuevamente.',
  1002: 'Usuario y/o contraseña no son correctos',

  // RegisterValidator (2000s)
  2001: 'El nombre de usuario es obligatorio',
  2002: 'El email es obligatorio',
  2003: 'Formato de email inválido',
  2004: 'La contraseña debe tener más caracteres',
  2005: 'La contraseña debe incluir al menos un número',
  2006: 'La contraseña debe incluir al menos una mayúscula',
  2007: 'La contraseña debe incluir al menos una minúscula',
  2008: 'La contraseña debe incluir al menos un carácter especial',

  // Roles / authorization
  7001: 'Rol inválido para esta operación',

  // Identity / UserManager
  8001: 'No se pudo completar la operación de identidad. Intenta nuevamente.',
};

export {
  frontendErrorMessage,
};
