const arrowSvg = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'><path fill='%236b7280' d='M7 10l5 5 5-5z'/></svg>")`;

export const selectArrowStyle = {
  backgroundImage: arrowSvg,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'center right 1rem',
};