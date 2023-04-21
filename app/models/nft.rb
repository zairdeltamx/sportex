# frozen_string_literal: true

class Nft < ApplicationRecord
  include Rails.application.routes.url_helpers
  extend Enumerize
  enumerize :status, in: %i[available sold], scope: true, default: :available

  has_one_attached :presale_image

  validates :price,
            :tokenId,
            :seller,
            :owner,
            :image,
            :name,
            :strength,
            :defense,
            :attack,
            :description,
            :meta, presence: true

  attribute :teamName, :string, default: 'default value'
  has_one_attached :presale_image

  def presale_image_url
    presale_image.attached? ? url_for(presale_image) : nil
  end

  def self.ransackable_attributes(_auth_object)
    %w(
      price
      name
      teamName
      attack
      defense
      strength
    )
  end

  def sold=(value)
    self.status = value ? 'sold' : 'available'
  end
end
