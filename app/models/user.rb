# frozen_string_literal: true

class User < ApplicationRecord
  validates :eth_address, presence: true, uniqueness: true
  validates :eth_nonce, presence: true, uniqueness: true
  validates :username, presence: true, uniqueness: true, length: { minimum: 5, message: 'must have at least 3 characters' }
  validates :email, presence: false, uniqueness: false

  has_one_attached :avatar

  validate :avatar_content_type

  private

  def avatar_content_type
    if avatar.attached? && !avatar.content_type.in?(%w[image/jpg image/jpeg image/png])
      errors.add(:avatar, 'debe ser una imagen JPG, JPEG o PNG')
    end
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  # devise :database_authenticatable, :registerable,
  #        :recoverable, :rememberable, :validatable
  devise :database_authenticatable, :registerable, :rememberable, :validatable

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
