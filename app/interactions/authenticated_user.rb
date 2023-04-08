# frozen_string_literal: true

require 'eth'
require 'time'

class AuthenticatedUser < ActiveInteraction::Base
  string :eth_address
  string :eth_message
  string :eth_signature

  attr_accessor :user

  def execute
    @user = User.find_by(eth_address:)

    return if user.blank?

    if eth_signature.present?
      message = eth_message
      signature = eth_signature

      user_address = user.eth_address
      user_nonce = user.eth_nonce

      _, request_time, signed_nonce = message.split(',')
      request_time = Time.zone.at(request_time.to_f / 1000.0)
      expiry_time = request_time + 300

      sane_checkpoint = Time.parse '2021-01-01 00:00:00 UTC'

      if request_time && (request_time > sane_checkpoint) && (Time.zone.now < expiry_time)
        signature_pubkey = Eth::Signature.personal_recover message, signature
        signature_address = Eth::Util.public_key_to_address signature_pubkey

        if signed_nonce.eql?(user_nonce) &&
           user_address.downcase.eql?(signature_address.to_s.downcase)
          user.eth_nonce = SecureRandom.uuid
          user.save

          # Return the authenticated user
          user
        else
          errors.add(:eth_signature, 'Signed nonce does not match!')
        end
      else
        errors.add(:eth_signature, 'Please, sign the message in your Ethereum wallet!')
      end
    else
      errors.add(:eth_address, 'No such user exists, try to sign up!')
    end
  end
end
