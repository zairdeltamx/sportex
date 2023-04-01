# frozen_string_literal: true

require 'eth'

module Api
  module V1
    class UsersController < ApiController
      skip_before_action :verify_authenticity_token

      # do not allow to index all users
      # def index
      #   puts "AQUI ENTRA tambien 2 AMIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"

      #   render json: nil

      # end

      # creates a public API that allows fetching the user nonce by address
      def validate_nonce
        user = nil
        response = nil
        puts "AQUI ENTRA tambien 1 AMIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"

        # checks the parameter is a valid eth address
        params_address = Eth::Address.new params[:id]
        puts '--------------------------'
        puts params_address
        puts '--------------------------'
        if params_address.valid?

          # finds user by valid eth address (downcase to prevent checksum mismatches)
          user = User.find_by(eth_address: params[:id].downcase)
        end

        # do not expose full user object; just the nonce
        response = [eth_nonce: user.eth_nonce] if user&.id&.positive?

        # return response if found or nil in case of mismatch
        render json: response
      end

      def find_user
        if params[:metamaskAddress].blank?
          render json: {
                   data: 'Address is required',
                 }, status: 400
          return
        end
        user = User.find_by(eth_address: params[:metamaskAddress])
        if user
          render json: user, status: 200
        else
          render json: {
                   data: 'User not found',
                 }, status: 404
        end
      end

      def update_user
        if params[:address].blank?
          render json: {
                   data: 'Address is required',
                 }, status: 400
          return
        end
      
        user = User.find_by(eth_address: params[:address])
        if user
          if params[:email].present?
            if valid_email?(params[:email])
              user.update(email: params[:email])
            else
              render json: {
                       data: 'Invalid email format',
                     }, status: 400
              return
            end
          end
      
          if params[:username].present?
            if user.update(username: params[:username])
              render json: {
                       data: 'User updated',
                     }, status: 200
            else
              render json: {
                       data: 'Username is already taken',
                     }, status: 409
            end
            return
          end
      
          render json: {
                   data: 'User updated',
                 }, status: 200
        else
          render json: {
                   data: 'User not found',
                 }, status: 404
        end
      end
      
      def valid_email?(email)
        email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
        email_regex.match?(email)
      end
      

      # Método para actualizar la imagen de un producto

      def update_image
        puts '--------------------------------------------'
        puts params.inspect
        puts '--------------------------------------------'
        user = User.find(params[:id])
        if user
          if params[:avatar].blank?
            render json: {
                     data: 'Avatar is required',
                   }, status: 400
          else
            if user.update(avatar: params[:avatar])
              render json: {
                       data: 'Avatar updated',
                     }, status: 200
            else
              render json: {
                       data: 'Error updating avatar',
                     }, status: 500
            end
          end
        else
          render json: {
                   data: 'User not found',
                 }, status: 404
        end
      end
    end
  end
end
