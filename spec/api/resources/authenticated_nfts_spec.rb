# frozen_string_literal: true

require 'rails_helper'

describe Sportex::V1::Resources::AuthenticatedNfts do
  let!(:user) { create :user }
  let(:headers) { { 'HTTP_AUTHORIZATION' => user.token } }

  describe 'GET /authenticated_nfts/:id' do
    context 'when the user is authenticated' do
      it 'returns the nft purchased by the user' do
        get '/api/v1/current_user', {}, headers

        expect(last_response.status).to eq 200
      end
    end

    context 'when the user is not authenticated' do
      it 'returns 401' do
        get '/api/v1/current_user'

        expect(last_response.status).to eq 401
      end
    end
  end
end
