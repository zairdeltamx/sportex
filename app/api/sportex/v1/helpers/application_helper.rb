# frozen_string_literal: true

module Sportex
  module V1
    module Helpers
      module ApplicationHelper
        def extract(params)
          declared(params, { include_missing: false })
        end
      end
    end
  end
end
