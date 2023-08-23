# frozen_string_literal: true

require 'rails_helper'

describe Sportex::V1::Resources::Nfts do
  describe 'POST /api/v1/nfts' do
    context 'when nft does not exist' do
      it 'creates an nft' do
        expect do
          post '/api/v1/nfts', attributes_for(:nft)
        end.to change(Nft, :count).by(1)

        expect(last_response.status).to eq(201)
        expect(json_response.dig('json', 'message')).to eq('NFT updated')
      end
    end

    context 'when nft exists' do
      let!(:nft) { create(:nft) }

      it 'does not update the nft if there are no changes' do
        expect do
          post '/api/v1/nfts', attributes_for(:nft)
        end.not_to change(Nft, :count)

        expect(last_response.status).to eq(201)
        expect(json_response.dig('json', 'message')).to eq('NFT not updated')
        expect(nft.reload.price).to eq nft.price
      end

      it 'updates the nft if there are changes' do
        expect do
          post '/api/v1/nfts', attributes_for(:nft, price: 10.0) # Cambio aquí
        end.not_to change(Nft, :count)

        expect(last_response.status).to eq(201)
        expect(json_response.dig('json', 'message')).to eq('NFT updated')
        expect(nft.reload.price).to eq(10.0) # Cambio aquí
      end
    end
  end

  # describe 'DELETE /api/v1/nfts/:id' do
  #   let!(:nft) { create(:nft) }

  #   it 'deletes the nft' do
  #     expect(Nft.with_status(:available).reload).to include(nft)

  #     delete "/api/v1/nfts/#{nft.id}"

  #     expect(last_response.status).to eq(200)
  #     expect(json_response.dig('json', 'message')).to eq('NFT deleted')
  #     expect(Nft.with_status(:available).reload).to be_empty
  #   end
  # end
end
