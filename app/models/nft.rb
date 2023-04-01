class Nft < ApplicationRecord
  extend Enumerize
  enumerize :status, in: %i[available sold], scope: true, default: :available

  validates :price, presence: false
  validates :tokenId, presence: false
  attribute :teamName, :string, default: 'default value'
  validates :seller, presence: false
  validates :owner, presence: true
  validates :image, presence: true
  validates :name, presence: true
  validates :strength, presence: true
  validates :defense, presence: true
  validates :attack, presence: true
  validates :description, presence: true
  validates :meta, presence: true
  # validates :meta_json, presence: true
  #
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
end
