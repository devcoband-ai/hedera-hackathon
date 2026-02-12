Rails.application.routes.draw do
  root "songs#index"

  resources :songs do
    resources :tracks, except: [:index, :show]
    resources :contributions, except: [:index, :show]
    resource :provenance, only: [:show], controller: "provenance" do
      post :generate
      get "download/:id", action: :download, as: :download
    end
  end
end
