# frozen_string_literal: true

module Sportex
  module V1
    module Helpers
      module AuthenticationHelper
        def current_user
          return unless env

          @current_user ||= 'User'
        end

        def authenticate!
          error!('unauthorized', 401) unless current_user
        end

        def log_activity(type = :visit)
          current_user.activity_logs.with_activity_type(type)
                      .where(timestamp: Time.zone.now).first_or_create
        end
      end
    end
  end
end
