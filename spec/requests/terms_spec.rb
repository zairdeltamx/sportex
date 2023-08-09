# frozen_string_literal: true

require 'rails_helper'

describe 'Terms', type: :request do
  describe 'GET /index' do
    it 'returns http success' do
      get '/terms'
      expect(last_response.status).to eq 200
    end
  end
end
