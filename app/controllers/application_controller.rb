# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # make the helper methods available in our views
  helper_method :logged_in?

  # is anybody here? ;)
  def logged_in?
    !current_user.nil?
  end
end
