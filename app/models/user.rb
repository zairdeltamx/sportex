# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable
  # devise :validatable

  validates :eth_address, presence: true, uniqueness: { allow_nil: true }
  # validates :email, presence: true, unless: -> { email.blank? }
  validates :eth_nonce, presence: true, uniqueness: { allow_nil: true }
  validates :username, presence: true, uniqueness: true, length: { minimum: 5 }

  has_one_attached :avatar
  has_secure_token

  validate :avatar_content_type

  private

  def avatar_content_type
    return unless avatar.attached? && !avatar.content_type.in?(%w[image/jpg image/jpeg image/png])

    errors.add(:avatar, 'debe ser una imagen JPG, JPEG o PNG')
  end
end
