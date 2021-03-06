"use strict";

const config = require("./config.json");

const koa = require("koa");
const hbs = require("koa-hbs");
const serve = require("koa-static-folder");

// for passport support
const session = require("koa-generic-session");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");

const app = koa();

exports.app = app;
exports.passport = passport;

// the auth model for passport support
require("./models/auth");

// misc handlebars helpers
require("./helpers/handlebars");

// trust proxy
app.proxy = true;

// sessions
app.keys = [config.site.secret];
app.use(session());

// body parser
app.use(bodyParser());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// statically serve assets
app.use(serve("./assets"));

// load up the handlebars middlewear
app.use(hbs.middleware({
	viewPath: `${__dirname}/views`,
	layoutsPath: `${__dirname}/views/_layouts`,
	partialsPath: `${__dirname}/views/_partials`,
	defaultLayout: "main"
}));

app.use(function* appUse(next) {
	try {
		yield next;
	} catch (err) {
		if (this.state.api === true) {
			// if this was an API request, send the error back in a plain response
			this.body = {error: true, message: String(err)};
		} else {
			// this wasn"t an API request, show the error page
			this.app.emit("error", err, this);
			yield this.render("error", {
				dump: err
			});
		}
	}
});

require("./routes");

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

process.on("SIGINT", () => {
	process.exit();
});
