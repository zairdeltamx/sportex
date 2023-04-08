require 'rails_helper'

RSpec.describe "Landings", type: :request do
  describe "GET /landingpage" do
    it "returns http success" do
      get "/landing/landingpage"
      expect(response).to have_http_status(:success)
    end
  end

end
