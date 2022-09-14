Rails.application.routes.draw do
  # ethereum authentication demo
  root "dashboard#index"

  # authentication logic routes
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions"
  }

  # api to fetch nonces for users
  namespace :api do
    namespace :v1 do
      resources :users
    end
  end

  mount Sportex::V1::Api, at: '/', as: :api_root
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
end
