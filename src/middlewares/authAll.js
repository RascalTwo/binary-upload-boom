
import nc from "next-connect";
import passport from "passport";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import setupPassport from "../config/passport";
import dbConnect from "../config/mongoose";
import methodOverride from "method-override";

export default function authAll() {
	return nc()
		.use(async (req, res, next) => {
			await dbConnect();
			setupPassport(passport);
			next();
		})
		.use(methodOverride("_method"))
		.use(session({
			secret: "keyboard cat",
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
		}))
		.use(passport.initialize())
		.use(passport.session())
		.use(flash())
}