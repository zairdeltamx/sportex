# frozen_string_literal: true

ActiveAdmin.register Nft do
  actions :all, except: [:new]

  permit_params :presale_image
  filter :name

  form do |f|
    f.inputs do
      f.input :presale_image, as: :file
    end
    f.actions
  end
end
