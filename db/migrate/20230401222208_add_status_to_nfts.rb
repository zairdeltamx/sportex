class AddStatusToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :status, :string, default: 'available'
  end
end
