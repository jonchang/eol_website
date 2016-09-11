Rails.application.routes.draw do

  # Putting pages first only because it"s the most common:
  resources :pages, only: [:show]

  # Putting users second only because they tend to drive a lot of site behavior:
  devise_for :users, controllers: { registrations: "user/registrations",
                                    sessions: "user/sessions",
                                    omniauth_callbacks: "user/omniauth_callbacks"}
  resources :users do
    collection do
      post "delete_user", defaults: { format: "json" }
    end
  end

  # All of the "normal" resources:
  resources :collections
  resources :collection_items, only: [:new, :create]
  resources :open_authentications, only: [:new, :create]
  resources :traits, only: [:show] # TODO: more coming later...

  # Non-resource routes last:

  get "/search" => "search#search", :as => "search"

  # TODO: Change. We really want this to point to a (dynamic) CMS page of some
  # sort.
  root "users#index"
end
