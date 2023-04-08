Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: '/api/v1/graphiql', graphql_path: '/api/v1/graphql'
  end
  post '/api/v1/graphql', to: 'graphql#execute'
  # routes react
  get '/myassets', to: 'dashboard#index'
  get '/nftdetail/:id', to: 'dashboard#index'
  get '/createitem', to: 'dashboard#index'
  get '/profile', to: 'dashboard#index'
  get '/dashboard', to: 'dashboard#index', as: :dashboard

  # authentication logic routes
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions',
  }

  devise_scope :user do
    unauthenticated :user do
      root 'landing#index', as: :landing_page
    end

    authenticated :user do
      root 'dashboard#index'
    end
  end

  # Defines the root path route ("/")
  # root "articles#index"
  namespace :api do
    namespace :v1 do
      resources :users
      get 'findUser/:metamaskAddress', to: 'users#find_user'
      get 'verifyNonce/:id', to: 'users#validate_nonce'
      put 'updateUser/:address', to: 'users#update_user'
      put 'updateAvatar/:id', to: 'users#update_image'
    end
  end

  mount Sportex::V1::Api, at: '/', as: :api_root
end
