# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    # before_action :configure_sign_in_params, only: [:create]

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

    def destroy
      sign_out(current_user)
      # forget_me!(current_user)
      cookies.delete(:_sportex_session, httponly: true)

      redirect_to root_path
    end
  end
end
