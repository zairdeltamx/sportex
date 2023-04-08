# frozen_string_literal: true

module Sportex
  module V1
    class BaseApi < Grape::API
      def self.inherited(subclass)
        super
        subclass.instance_eval do
          format :json
          formatter :json, Grape::Formatter::ActiveModelSerializers
          use Grape::Middleware::Logger

          helpers Sportex::V1::Helpers::AuthenticationHelper
          helpers Sportex::V1::Helpers::ApplicationHelper
          helpers Sportex::V1::Helpers::SharedParams
        end
      end
    end
  end
end
