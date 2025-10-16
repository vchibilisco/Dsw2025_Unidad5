function Button({ children, type = 'button', ...restProps }) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  return (
    <button type={type} {...restProps}>{children}</button>
  );
};

export default Button;
