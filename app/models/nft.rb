class Nft < ApplicationRecord
  validates :price, presence: false
  validates :tokenId, presence: false
  validates :seller, presence: false
  validates :owner, presence: true
  validates :image, presence: true
  validates :name, presence: true
  validates :power, presence: true
  validates :defense, presence: true
  validates :attack, presence: true
  validates :description, presence: true
  validates :meta, presence: true
  # validates :meta_json, presence: true
end
