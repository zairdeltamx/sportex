# frozen_string_literal: true

require 'eth'

module Users
  class SessionsController < Devise::SessionsController
    # before_action :configure_sign_in_params, only: [:create]
    skip_before_action :verify_authenticity_token

    def create
      result = AuthenticatedUser.run(params)

      if result.valid?
        user = result.user
        sign_in user
        redirect_to root_path, notice: 'Logged in successfully!'
      else
        flash.alert = result.errors.full_messages.join(', ')
        render :new
      end
    end

    def login_movil
      address = Eth::Address.new(params[:eth_address])

      if address.valid?
        user = User.find_by(eth_address: params[:eth_address])

        if user.present? && user.username == params[:username]
          # Generar el token JWT
          jwt_payload = { user_id: user.id }
          token = JWT.encode(jwt_payload, JWT_SECRET, JWT_ALGORITHM)

          render json: { status: :success, message: 'Login successful', token: }
        else
          render json: { status: :error, message: 'User not found or invalid username' }
        end
      else
        render json: { status: :error, message: 'Invalid MetaMask address' }
      end
    end

    def destroy
      sign_out(current_user)
      # forget_me!(current_user)
      cookies.delete(:_sportex_session, httponly: true)

      redirect_to root_path
    end
  end
end
