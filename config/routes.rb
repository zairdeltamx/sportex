Rails.application.routes.draw do
  root to: 'dashboard#index'

  get '*all', to: 'dashboard#index', constraints: ->(req) do
    req.path.exclude?('rails/active_storage') || req.path.exclude?('assets')
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"
end
