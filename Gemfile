source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.2'

gem 'enumerize'

gem 'faker'

gem 'rspec-rails'

gem 'annotate'

gem 'ransack'

gem 'rubocop'

gem 'rubocop-rails'

gem 'rubycritic'

gem 'yard'

gem 'simplecov'

gem 'sidekiq'

gem 'rspec-its'

gem 'rspec-mocks'

gem 'httparty'

gem 'rspec-retry'

gem 'brakeman'

gem 'factory_bot_rails'

gem 'database_cleaner'

gem 'rollbar'

gem 'solargraph'

gem 'rack-test'

gem 'activeadmin'
gem 'active_skin'
gem 'kaminari'

gem 'aws-sdk-s3'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 7.0.4'

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'sprockets-rails'

# Use sqlite3 as the database for Active Record
gem 'sqlite3', '~> 1.4'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 5.0'


# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem 'jsbundling-rails'

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem 'turbo-rails'

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem 'stimulus-rails'

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jbuilder'

# Use Redis adapter to run Action Cable in production
gem 'redis'

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem 'bcrypt', '~> 3.1.7'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[ mingw mswin x64_mingw jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Sass to process CSS
gem 'sassc-rails'

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  gem "rails_live_reload"

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[ mri mingw x64_mingw ]
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # We may be able to remove this when a future version of bundler comes out.
  # See https://github.com/bundler/bundler/issues/6929#issuecomment-459151506 and
  # https://github.com/bundler/bundler/pull/6963 for more information.
  gem 'irb', require: false
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'web-console'
  gem 'spring'

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem 'capybara'
  gem 'shoulda-matchers'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

gem 'config'

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem 'importmap-rails'

# Use Ruby-Eth for signature recovery
gem 'eth', '~> 0.5'

gem 'active_interaction'

gem 'pry'

gem 'blueprinter'
gem 'oj'
# API
gem 'grape'
gem 'grape-swagger'
gem 'grape-middleware-logger'
gem 'grape-active_model_serializers'
gem 'grape_on_rails_routes', '~> 0.3.2'
gem 'grape-swagger-rails', github: 'ruby-grape/grape-swagger-rails'
gem 'active_model_serializers', '~> 0.10.0'
gem 'hashie-forbidden_attributes'

gem 'graphql'
gem 'rack-cors'

group :production do
  # Use postgresql as the database for Active Record
  gem 'pg', '~> 1.1'
end

gem 'bootstrap', '~> 5.2'
gem 'graphiql-rails', group: :development

gem 'graphql-pagination', '~> 2.0'
gem 'devise', '~> 4.2'

gem 'rails_12factor', group: :production

gem "foreman", "~> 0.87.2"
