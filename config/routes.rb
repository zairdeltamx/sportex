Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: '/api/v1/graphiql', graphql_path: '/graphql'
  end
  post '/graphql', to: 'graphql#execute'
  root 'dashboard#index'

  # authentication logic routes
  devise_for :users, controllers: {
                       registrations: 'users/registrations',
                       sessions: 'users/sessions',
                     }
  # Defines the root path route ("/")
  # root "articles#index"
  namespace :api do
    namespace :v1 do
      resources :users
      get 'findUser/:address', to: 'users#find_user'
      put 'updateUsername/:address', to: 'users#update_username'
      put 'updateAvatar/:id', to: 'users#update_image'
      put 'updateEmail/:address', to: 'users#updateEmai'
    end
  end
  mount Sportex::V1::Api, at: '/', as: :api_root
end
