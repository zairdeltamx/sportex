Rails.application.routes.draw do
  root to: 'dashboard#index'

  mount Sportex::V1::Api, at: '/', as: :api_root
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
end
