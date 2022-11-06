import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../config/mongoose';
import User from '../../../models/User';

export const authOptions = {
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) token.user = user
			return token;
		},
		async session({ session, token }) {
			if (token?.user) session.user = token.user;
			return session;
		},
	},
	jwt: {
		secret: 'keyboard cat',
		encryption: true,
		signingKey: '{"kty":"oct","kid":"dzhiTentYlr7WxQulaqtnVozJYcXoMwixGgTo5Npg2c","alg":"HS512","k":"nObquxyqAdhK8dk6PC0amERSuw10gNxCFCUjRBnbsXs"}',
		encryptionKey: '{"kty":"oct","kid":"1LlPJdNtSQAwRX_zbr0r_k86rMhvAFVUxmzX616HEtk","alg":"A256GCM","k":"OVeA9l7sSeSiND62POfpcV72FFhxwFyeVLKSmI1368g"}'
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				await dbConnect();
				if (!credentials.signUp) {
					const user = await User.findOne({ email: credentials.email.toLowerCase() }).populate({
						path: "following",
						populate: { path: 'receiver' }
					}).populate({
						path: "followers",
						populate: { path: 'sender' }
					})
					if (!user) throw new Error(`Email ${credentials.email} not found.`);
					const isMatch = user.comparePassword(credentials.password)
					if (isMatch) return user.toObject();
					throw new Error("Invalid email or password.");
				}

				const existingUser = await User.findOne({ $or: [{ email: credentials.email }, { userName: credentials.userName }] })

				if (existingUser) throw new Error("Account with that email address or username already exists.")
				return {
					...(await new User({
						userName: credentials.userName,
						email: credentials.email,
						password: credentials.password,
					}).save()).toObject(),
					following: [],
					followers: []
				};
			}
		})
	],
}

export default NextAuth(authOptions)