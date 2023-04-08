# frozen_string_literal: true

class NftChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'nftdeleted'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
