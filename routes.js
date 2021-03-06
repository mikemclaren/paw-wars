"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const main = require("./controllers/main.js");
const manual = require("./controllers/manual.js");

const game_hotel = require("./controllers/game_hotel.js");
const game_bank = require("./controllers/game_bank.js");
const game_market = require("./controllers/game_market.js");
const game_airport = require("./controllers/game_airport.js");
const game_police = require("./controllers/game_police.js");
const game_life = require("./controllers/game_life.js");

// routes
const player = null;

// app routes
routes.get("/", main.index);
routes.get("/account", main.account);

// game routes (these will be replaced by controllers)
routes.get("/play", game_life.play);
routes.post("/game/life", game_life.create);
routes.get("/game/over", game_life.end);

// manual routes
routes.get("/manual", manual.index);
routes.get("/manual/:page", manual.index);

// hotel routes
routes.get("/game/hotel", game_hotel.index);

// market routes
routes.get("/game/market", game_market.index);
routes.post("/game/market/transaction", game_market.transaction);

// airport routes
routes.get("/game/airport", game_airport.index);
routes.post("/game/airport/fly", game_airport.fly);

// bank routes
routes.get("/game/bank", game_bank.index);
routes.get("/game/bank/savings", game_bank.transaction);
routes.post("/game/bank/savings", game_bank.transaction);
routes.get("/game/bank/loans", game_bank.lending);
routes.post("/game/bank/loans", game_bank.lending);

// police routes
routes.get("/game/police", game_police.index);
routes.post("/game/police/encounter", game_police.encounter);

// for passport
routes.get("/login", function* get() {
	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.render("login", {player: player});
});

routes.get("/logout", function* get() {
	this.logout();
	this.redirect("/");
	yield this.render("index", {player: player});
});

// you can add as many strategies as you want
routes.get("/auth/github",
	passport.authenticate("github")
);

routes.get("/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/account",
		failureRedirect: "/"
	})
);

app.use(routes.middleware());
