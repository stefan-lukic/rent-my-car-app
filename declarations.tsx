declare module 'bcryptjs' {
  const bcrypt: {
    hash: (password: string, saltRounds: number) => string;
    compare: (password: string, hash: string) => boolean;
    genSaltSync: (saltRounds?: number) => string;
  };
  export default bcrypt;
}
