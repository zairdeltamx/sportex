# frozen_string_literal: true

FactoryBot.define do
  factory :nft do
    price { 1 }
    tokenId { 1 }
    seller { '0x0000000000000000000000000000000000000000' }
    owner { '0x0000000000000000000000000000000000000000' }
    image { 'https://images.unsplash.com/photo-1616166330001-8c1b0b1b1b1b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' }
    name { 'NFT' }
    description { 'NFT' }
    strength { 1 }
    defense { 1 }
    attack { 1 }
    meta { '{ "name": "name" }' }
  end
end
