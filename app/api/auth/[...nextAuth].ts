import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_USERS_URI!;

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "이메일을 입력해주세요." },
        password: { label: "password", type: "password", placeholder: "비밀번호를 입력해주세요." },
      },
      // 로그인 유효성 검사
      async authorize(credentials) {
        const client = await MongoClient.connect(uri);

        const user = await client.db().collection("users").findOne({
          email: credentials!.email,
        });

        client.close();
        return { id: user!.id };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const client = await MongoClient.connect(uri);

        const user = await client.db().collection("users").findOne({
          email: token.email,
        });

        if (!user) {
          client.close();
          throw new Error("존재하지 않는 계정입니다.");
        }
      }
      return token;
    },
    session({ session }) {
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
