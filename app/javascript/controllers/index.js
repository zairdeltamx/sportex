// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import HelloController from "./hello_controller"
application.register("hello", HelloController)

import ReactController from "./react_controller"
application.register("react", ReactController)

import SessionsController from "./sessions_controller"
application.register("sessions", SessionsController)

import UsersController from "./users_controller"
application.register("users", UsersController)
import LandingController from "./landing_controller"
application.register("landing", LandingController)
import TermsController from "./terms_controller"
application.register("terms", TermsController)
