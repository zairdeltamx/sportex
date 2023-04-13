# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :rememberable, :validatable

  validates :eth_address, :eth_nonce, :username, presence: true, uniqueness: true
  validates :username, presence: true, uniqueness: true,
                       length: { minimum: 5 }
  validates :email, presence: false, uniqueness: false

  has_one_attached :avatar
  has_secure_token

  validate :avatar_content_type

  private

  def avatar_content_type
    return unless avatar.attached? && !avatar.content_type.in?(%w[image/jpg image/jpeg image/png])

    errors.add(:avatar, 'debe ser una imagen JPG, JPEG o PNG')
  end

  def encrypted_password
    false
  end

  def password_required?
    false
  end

  def email_required?
    false
  end
end
