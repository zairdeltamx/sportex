# frozen_string_literal: true

require 'rails_helper'

describe Sportex::V1::Resources::Marketplace do
  let!(:user) { create :user }
  let(:headers) { { 'HTTP_AUTHORIZATION' => user.token } }

  describe 'GET /marketplace' do
    context 'when user is not authenticated' do
      it 'returns a 401' do
        get '/api/v1/marketplace'
        expect(last_response.status).to eq 401
      end
    end

    context 'when user is authenticated' do
      it 'returns a 200' do
        get '/api/v1/marketplace', {}, headers
        expect(last_response.status).to eq 200
      end
    end
  end
end
