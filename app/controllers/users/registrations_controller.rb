# frozen_string_literal: true

require 'eth'

module Users
  class RegistrationsController < Devise::RegistrationsController
    # POST /resource
    skip_before_action :verify_authenticity_token

    def create
      @user = User.new(user_params)
      @user.eth_nonce = SecureRandom.uuid

      if @user.valid?
        if @user.eth_address
          address = Eth::Address.new @user.eth_address

          if address.valid? && @user.save
            redirect_to new_user_session_path,
                        notice: 'Successfully created an account, you may now log in.'
          else
            redirect_to new_user_session_path,
                        alert: 'Account already exists! Try to log in instead!'
          end
        else
          flash.now[:alert] = 'Failed to get Ethereum address!'
          render :new
        end
      else
        flash.now[:alert] = @user.errors.full_messages.join(', ')
        render :new
      end
    end

    def register_movil
      @user = User.new(user_params)
      @user.eth_nonce = SecureRandom.uuid

      address = Eth::Address.new(@user.eth_address)

      unless address.valid?
        render json: { status: :error, message: 'Invalid MetaMask address' }
        return
      end

      unless @user.valid?
        render json: { status: :error, message: 'Invalid user data',
                       errors: @user.errors.full_messages }
        return
      end

      if User.exists?(eth_address: @user.eth_address)
        render json: { status: :error, message: 'User already exists' }
      elsif @user.save
        render json: { status: :success, message: 'Registration successful' }
      else
        render json: { status: :error, message: 'Failed to save user' }
      end
    end

    def user_params
      # only allow user to control name, message, signature, and address
      params.require(:user).permit(:username, :eth_address)
    end
  end
end
