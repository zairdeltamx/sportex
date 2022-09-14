# frozen_string_literal: true

require 'eth'

class BaseConnection < ActiveInteraction::Base
  ABI_STRING = File.read("#{Rails.root.join('spec', 'fixtures')}nft_marketplace.json")

  def eth_client
    @client ||= Eth::Client.create 'https://rpc.v2b.testnet.pulsechain.com'
  end

  def abi_path
    @abi_path ||= Rails.root.join(
      'app',
      'javascript',
      'artifacts',
      'contracts',
      'NFTMarketplace.sol'
    ) + 'NFTMarketplace.json'
  end

  # TODO: move to constants
  def contract
    @contract ||= Eth::Contract.from_abi(
      name: 'NFTMarketplace',
      address: '0x494d06A3Ef3C23B92ECd8c10e736bFC0f78a265D',
      abi: JSON.parse(BaseConnection::ABI_STRING)
    )
  end

  def execute
  end
end
