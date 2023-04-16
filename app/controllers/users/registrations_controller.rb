# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    # POST /resource
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

    def user_params
      # only allow user to control name, message, signature, and address
      params.require(:user).permit(:username, :eth_address)
    end
  end
end
