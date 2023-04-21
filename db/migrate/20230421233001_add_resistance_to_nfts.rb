class AddResistanceToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :resistance, :float
  end
end
