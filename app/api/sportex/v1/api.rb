# frozen_string_literal: true

module Sportex
  module V1
    class Api < Grape::API
      version 'v1', using: :path
      prefix :api
      format :json
      formatter :json, Grape::Formatter::ActiveModelSerializers
      use Grape::Middleware::Logger

      before do
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Request-Method'] = '*'
      end

      rescue_from ActiveRecord::RecordNotFound do |e|
        Rollbar.warning(e)
        error!(e.message, 404)
      end

      rescue_from ActiveRecord::RecordInvalid do |e|
        Rollbar.warning(e)
        error!(e.message, 400)
      end

      rescue_from Grape::Exceptions::ValidationErrors do |e|
        Rollbar.warning(e)
        error_response message: e.message, status: 400
      end

      rescue_from :all do |e|
        Rails.logger.tagged('API') do |logger|
          logger.info "error: #{e.class.name} | #{e.message}"
        end

        message = Rails.env.production? ? 'server error' : e.message
        Rollbar.error(e)
        error!(message, 500)
      end

      mount Sportex::V1::AuthenticatedApi

      add_swagger_documentation(
        api_version: 'v1',
        mount_path: '/api-docs',
        hide_format: true,
        info: {
          title: 'Sportex API v1.0',
          description: 'Mobile API for Sportex Fitness Planner'
        }
      )
    end
  end
end
