# frozen_string_literal: true

class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def checkout
    nft = Nft.find_by(tokenId: params[:nftTokenId])

    if nft.nil?
      render json: { success: false, message: 'NFT not found' }, status: :not_found
      return
    end

    if nft.status == 'sold'
      render json: { message: 'NFT is sold', success: false }, status: :conflict
    elsif nft.status == 'purchasing'
      render json: { message: 'NFT is being purchased', success: false }, status: :conflict
    else
      nft.update(purchasing: true)
      begin
        charge = Stripe::Charge.create({ source: params[:token], amount: params[:amount],
                                         currency: 'usd',
                                         metadata: { nftToken: params[:nftTokenId],
                                                     buyerAddress: params[:buyerAddress] } })
        Payment.create!({
                          stripeChargeId: charge.id,
                          amount: charge.amount,
                          currency: charge.currency,
                          nftTokenId: params[:nftTokenId],
                          buyerAddress: params[:buyerAddress]
                        })
        nft.update(status: 'sold')
        render json: { success: true, message: 'Payment completed successfully' }, status: :ok
      rescue Stripe::CardError => e
        render json: { success: false, message: 'Error processing payment, try again later',
                       errors: e.message },
               status: :unprocessable_entity
      ensure
        nft.update(purchasing: false)
      end
    end
  end
end
