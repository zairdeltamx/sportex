class AddPurchasingToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :purchasing, :boolean, :default => false
  end
end
