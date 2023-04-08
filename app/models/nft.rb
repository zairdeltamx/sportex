# frozen_string_literal: true

class Nft < ApplicationRecord
  extend Enumerize
  enumerize :status, in: %i[available sold], scope: true, default: :available

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
