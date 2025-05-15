export type User = {
  id: string;
  email: string | null;
  name: string | null;
  token?: string | null;
  role: roleUserType;
  image: string | null;
  isBanned: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

declare module "next-auth" {
  interface User {
    id: string;
    email: string | null;
    name: string | null;
    token?: string | null;
    role: roleUserType;
    image: string | null;
    isBanned: boolean;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      token?: string | null;
      role: roleUserType;
      image: string | null;
      isBanned: boolean;
      emailVerified: Date | null;
      createdAt: Date;
      updatedAt: Date;
    };
    token: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: any;
      sub?: string;
      email?: string | null;
      name?: string | null;
      picture?: string | null;
      role?: roleUserType;
      tel?: string;
      emailVerified?: Date | null;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }
}
