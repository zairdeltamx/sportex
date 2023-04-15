# frozen_string_literal: true
ActiveAdmin.register_page "Dashboard" do
  content do
    render partial: "nft_control"
  end
end
