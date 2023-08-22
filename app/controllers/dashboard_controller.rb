# frozen_string_literal: true

class DashboardController < ApplicationController
  before_action :authenticate_user_or_jwt!

  def authenticate_user_or_jwt!
    if request.headers['Authorization'].present?
      authenticate_with_jwt!
    else
      authenticate_user!
    end
  end

  def index
  end

  private

  def authenticate_with_jwt!
    # Assuming the token is sent in the Authorization header
    token = request.headers['Authorization']
    token = token[7..] if token&.start_with?('Bearer')
    begin
      decoded_token = JWT.decode(token, JWT_SECRET, true, algorithm: JWT_ALGORITHM)
      jwt_payload = decoded_token.first

      # Verify if the user ID in the token matches the user ID
      @current_user = User.find_by(id: jwt_payload['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { status: :error, message: 'Invalid token' }
    end
  end
end
