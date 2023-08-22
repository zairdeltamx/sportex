# frozen_string_literal: true

FactoryBot.define do
  factory :payment do
    nft_token_id { 1 }
    ticket_id { 1 }
    buyer_address { 'MyString' }
    created { '2023-05-23' }
    amount_paid { '9.99' }
  end
end
