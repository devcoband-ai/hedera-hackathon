Rails.application.routes.draw do
  root "songs#index"

  get "topics/:topic_id", to: "topic_explorer#show", as: :topic_explorer

  resources :songs do
    resources :tracks, except: [:index, :show]
    resources :contributions, except: [:index, :show]
    resource :provenance, only: [:show], controller: "provenance" do
      post :generate
      get "download/:id", action: :download, as: :download
      get :package
      get :certificate
    end
  end
end
