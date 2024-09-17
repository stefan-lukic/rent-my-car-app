declare module 'bcryptjs' {
  const bcrypt: {
    hash: (password: string, saltRounds: number) => string;
    compareSync: (password: string, hash: string) => boolean;
    genSaltSync: (saltRounds?: number) => string;
  };
  export default bcrypt;
}
