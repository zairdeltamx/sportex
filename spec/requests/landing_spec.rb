# frozen_string_literal: true

require 'rails_helper'

describe 'Landings', type: :request do
  describe 'GET /' do
    it 'returns http success' do
      get '/'
      expect(last_response.status).to eq 200
    end
  end
end
