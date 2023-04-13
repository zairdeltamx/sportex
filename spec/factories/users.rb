# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    eth_address { Faker::Blockchain::Ethereum.address }
    eth_nonce { Faker::Blockchain::Ethereum.address }
    username { Faker::Internet.username(specifier: 8) }
    email { Faker::Internet.email }
  end
end
