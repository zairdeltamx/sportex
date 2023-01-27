class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id, :username, :email, :avatar, :avatar_url, :eth_address, :eth_nonce

  def avatar_url
    if object.avatar.attached?
      # rails_blob_url(object.avatar, host: 'https://sportex.herokuapp.com')
      rails_blob_url(object.avatar, host: 'http://localhost:3000')
    else
      'Not Found'
    end
  end
end
